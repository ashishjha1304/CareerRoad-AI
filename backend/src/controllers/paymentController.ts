import { Response } from 'express';
import { AuthRequest } from '../middleware/authMiddleware';
import { supabase } from '../config/supabase';
import { successResponse, errorResponse } from '../utils/apiResponse';

const UPI_ID = '8591852039@fam';
const PRO_AMOUNT = 499;

/**
 * POST /api/payments/create-order
 * Returns UPI payment details for manual payment.
 * Also records a pending payment entry in the DB.
 */
export const createOrder = async (req: AuthRequest, res: Response) => {
  const { amount } = req.body;
  const userId = req.user?.id;

  if (!amount || !userId) {
    return res.status(400).json({ error: 'Amount and auth are required' });
  }

  try {
    // Record a pending payment entry
    const { data: payment, error: insertError } = await supabase
      .from('payments')
      .insert([{
        user_id: userId,
        amount: Number(amount),
        status: 'pending',
      }])
      .select()
      .single();

    if (insertError) {
      console.error('Error inserting payment:', insertError);
      // Non-fatal: still show the UPI details
    }

    return successResponse(res, {
      upiId: UPI_ID,
      amount,
      paymentId: payment?.id || null,
      note: 'After payment, share screenshot with your Payment ID for verification.',
    }, 'Pay via UPI to upgrade to Pro');
  } catch (error: any) {
    return errorResponse(res, error.message || 'Failed to create payment order');
  }
};

/**
 * POST /api/payments/verify
 * Body: { paymentId: string }
 * Called by admin or automated webhook to confirm a payment and upgrade user.
 *
 * NOTE: In production you would verify a webhook signature here.
 * For this MVP, this endpoint is protected by auth (service key) and
 * can be triggered manually to confirm a payment.
 */
export const verifyPayment = async (req: AuthRequest, res: Response) => {
  const { paymentId } = req.body;
  const userId = req.user?.id;

  if (!paymentId || !userId) {
    return errorResponse(res, 'paymentId is required', 400);
  }

  try {
    // Step 1: Find the payment record (must belong to this user)
    const { data: payment, error: paymentError } = await supabase
      .from('payments')
      .select('*')
      .eq('id', paymentId)
      .eq('user_id', userId)
      .single();

    if (paymentError || !payment) {
      return errorResponse(res, 'Payment record not found', 404);
    }

    if (payment.status === 'success') {
      return successResponse(res, { alreadyPro: true }, 'Payment already verified. You are Pro!');
    }

    // Step 2: Mark payment as successful
    const { error: updatePaymentError } = await supabase
      .from('payments')
      .update({ status: 'success' })
      .eq('id', paymentId);

    if (updatePaymentError) throw updatePaymentError;

    // Step 3: Upgrade user profile to Pro
    const { error: updateProfileError } = await supabase
      .from('profiles')
      .update({ subscription_status: 'pro', updated_at: new Date() })
      .eq('id', userId);

    if (updateProfileError) throw updateProfileError;

    return successResponse(res, {
      paymentId,
      subscriptionStatus: 'pro',
    }, '🎉 Payment verified! Pro access has been activated.');
  } catch (error: any) {
    return errorResponse(res, error.message || 'Payment verification failed');
  }
};

/**
 * GET /api/payments/status
 * Returns the current user's subscription status.
 */
export const getPaymentStatus = async (req: AuthRequest, res: Response) => {
  const userId = req.user?.id;

  if (!userId) return errorResponse(res, 'Unauthorized', 401);

  try {
    const { data: profile, error } = await supabase
      .from('profiles')
      .select('subscription_status')
      .eq('id', userId)
      .single();

    if (error) throw error;

    return successResponse(res, {
      subscriptionStatus: profile?.subscription_status || 'free',
      isPro: profile?.subscription_status === 'pro',
    }, 'Subscription status fetched');
  } catch (error: any) {
    return errorResponse(res, error.message || 'Failed to fetch subscription status');
  }
};

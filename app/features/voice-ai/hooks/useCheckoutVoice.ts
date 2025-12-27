'use client';

import { useEffect, useRef } from 'react';
import { useAIVoice } from './useAIVoice';
import { usePageContext } from './usePageContext';

export function useCheckoutVoice(formData: any) {
    const { generateAndSpeak } = useAIVoice();
    const { context } = usePageContext();
    const guidanceGivenRef = useRef<Set<string>>(new Set());

    // Name field completion
    useEffect(() => {
        if (formData?.name && formData.name.length > 2 && !guidanceGivenRef.current.has('name')) {
            guidanceGivenRef.current.add('name');
            setTimeout(() => {
                generateAndSpeak(context, 'name_field_completed', { nextField: 'email' });
            }, 500);
        }
    }, [formData?.name, context, generateAndSpeak]);

    // Email field completion
    useEffect(() => {
        if (formData?.email && formData.email.includes('@') && !guidanceGivenRef.current.has('email')) {
            guidanceGivenRef.current.add('email');
            setTimeout(() => {
                generateAndSpeak(context, 'email_field_completed', { nextField: 'phone' });
            }, 500);
        }
    }, [formData?.email, context, generateAndSpeak]);

    // Phone field completion
    useEffect(() => {
        if (formData?.phone && formData.phone.length >= 10 && !guidanceGivenRef.current.has('phone')) {
            guidanceGivenRef.current.add('phone');
            setTimeout(() => {
                generateAndSpeak(context, 'phone_field_completed', { nextField: 'address' });
            }, 500);
        }
    }, [formData?.phone, context, generateAndSpeak]);

    // Address field completion
    useEffect(() => {
        if (formData?.address && formData.address.length > 10 && !guidanceGivenRef.current.has('address')) {
            guidanceGivenRef.current.add('address');
            setTimeout(() => {
                generateAndSpeak(context, 'address_field_completed', { nextField: 'city' });
            }, 500);
        }
    }, [formData?.address, context, generateAndSpeak]);

    // City field completion
    useEffect(() => {
        if (formData?.city && formData.city.length > 2 && !guidanceGivenRef.current.has('city')) {
            guidanceGivenRef.current.add('city');
            setTimeout(() => {
                generateAndSpeak(context, 'city_field_completed', { nextField: 'state' });
            }, 500);
        }
    }, [formData?.city, context, generateAndSpeak]);

    // State field completion
    useEffect(() => {
        if (formData?.state && formData.state.length > 2 && !guidanceGivenRef.current.has('state')) {
            guidanceGivenRef.current.add('state');
            setTimeout(() => {
                generateAndSpeak(context, 'state_field_completed', { nextField: 'pincode' });
            }, 500);
        }
    }, [formData?.state, context, generateAndSpeak]);

    // Pincode validation
    useEffect(() => {
        if (formData?.pincode && formData.pincode.length === 5 && !guidanceGivenRef.current.has('pincode')) {
            guidanceGivenRef.current.add('pincode');
            setTimeout(() => {
                generateAndSpeak(context, 'pincode_validated', {
                    city: formData.city,
                    state: formData.state
                });
            }, 500);
        }
    }, [formData?.pincode, formData?.city, formData?.state, context, generateAndSpeak]);

    return { guidanceGivenRef };
}

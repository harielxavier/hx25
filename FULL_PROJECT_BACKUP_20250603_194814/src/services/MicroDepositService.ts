interface ChangeOrder {
  id: string;
  jobId: string;
  clientId: string;
  type: 'timeline' | 'scope' | 'location' | 'equipment' | 'personnel' | 'travel';
  description: string;
  originalValue: any;
  newValue: any;
  requestedBy: 'client' | 'photographer' | 'vendor';
  requestedAt: Date;
  status: 'pending' | 'approved' | 'rejected' | 'invoiced' | 'paid';
  costImpact: CostImpact;
  microDeposit?: MicroDeposit;
  approvedAt?: Date;
  approvedBy?: string;
  reason?: string;
}

interface CostImpact {
  additionalHours: number;
  hourlyRate: number;
  travelCosts: number;
  equipmentCosts: number;
  vendorCosts: number;
  totalAmount: number;
  breakdown: CostBreakdown[];
  confidence: number; // 0-1 confidence in cost calculation
}

interface CostBreakdown {
  category: 'time' | 'travel' | 'equipment' | 'vendor' | 'overhead';
  description: string;
  quantity: number;
  unitCost: number;
  totalCost: number;
  justification: string;
}

interface MicroDeposit {
  id: string;
  changeOrderId: string;
  amount: number;
  currency: 'USD';
  status: 'pending' | 'processing' | 'completed' | 'failed' | 'refunded';
  paymentMethod: 'card' | 'bank_transfer' | 'digital_wallet';
  stripePaymentIntentId?: string;
  createdAt: Date;
  paidAt?: Date;
  failureReason?: string;
  refundedAt?: Date;
  refundReason?: string;
}

interface PricingRules {
  baseHourlyRate: number;
  overtimeMultiplier: number; // 1.5x for overtime
  weekendMultiplier: number; // 2x for weekends
  holidayMultiplier: number; // 2.5x for holidays
  travelRates: {
    local: number; // per mile
    regional: number; // per mile
    destination: number; // per day
  };
  equipmentRates: {
    [equipmentType: string]: number; // per day
  };
  minimumCharges: {
    timeChange: number; // minimum charge for time changes
    locationChange: number; // minimum charge for location changes
    equipmentAdd: number; // minimum charge for equipment additions
  };
  thresholds: {
    autoApprove: number; // auto-approve changes under this amount
    requireDeposit: number; // require deposit for changes over this amount
    requireFullPayment: number; // require full payment for changes over this amount
  };
}

interface PaymentProvider {
  name: 'stripe' | 'square' | 'paypal';
  apiKey: string;
  webhookSecret: string;
  enabled: boolean;
}

class MicroDepositService {
  private pricingRules: PricingRules;
  private paymentProviders: PaymentProvider[];
  private stripeApiKey: string;
  
  constructor() {
    this.stripeApiKey = process.env.REACT_APP_STRIPE_SECRET_KEY || '';
    
    this.pricingRules = {
      baseHourlyRate: 150, // $150/hour base rate
      overtimeMultiplier: 1.5,
      weekendMultiplier: 2.0,
      holidayMultiplier: 2.5,
      travelRates: {
        local: 0.65, // $0.65 per mile (IRS rate)
        regional: 0.65,
        destination: 200 // $200 per day for destination weddings
      },
      equipmentRates: {
        'second_camera': 50,
        'drone': 100,
        'lighting_kit': 75,
        'video_equipment': 150,
        'backup_photographer': 300
      },
      minimumCharges: {
        timeChange: 25,
        locationChange: 50,
        equipmentAdd: 30
      },
      thresholds: {
        autoApprove: 50, // Auto-approve changes under $50
        requireDeposit: 100, // Require 50% deposit for changes over $100
        requireFullPayment: 500 // Require full payment for changes over $500
      }
    };

    this.paymentProviders = [
      {
        name: 'stripe',
        apiKey: this.stripeApiKey,
        webhookSecret: process.env.REACT_APP_STRIPE_WEBHOOK_SECRET || '',
        enabled: true
      }
    ];
  }

  /**
   * Analyze a change order and calculate cost impact
   */
  async analyzeChangeOrder(changeOrder: ChangeOrder): Promise<CostImpact> {
    try {
      console.log(`Analyzing change order: ${changeOrder.type}`);
      
      let costImpact: CostImpact;
      
      switch (changeOrder.type) {
        case 'timeline':
          costImpact = await this.calculateTimelineCosts(changeOrder);
          break;
        case 'location':
          costImpact = await this.calculateLocationCosts(changeOrder);
          break;
        case 'equipment':
          costImpact = await this.calculateEquipmentCosts(changeOrder);
          break;
        case 'personnel':
          costImpact = await this.calculatePersonnelCosts(changeOrder);
          break;
        case 'travel':
          costImpact = await this.calculateTravelCosts(changeOrder);
          break;
        case 'scope':
          costImpact = await this.calculateScopeCosts(changeOrder);
          break;
        default:
          costImpact = this.getDefaultCostImpact();
      }
      
      // Apply AI enhancement to cost calculation
      const enhancedCostImpact = await this.enhanceCostCalculationWithAI(costImpact, changeOrder);
      
      return enhancedCostImpact;
      
    } catch (error) {
      console.error('Error analyzing change order:', error);
      return this.getDefaultCostImpact();
    }
  }

  /**
   * Calculate costs for timeline changes
   */
  private async calculateTimelineCosts(changeOrder: ChangeOrder): Promise<CostImpact> {
    const originalTime = new Date(changeOrder.originalValue);
    const newTime = new Date(changeOrder.newValue);
    
    // Calculate time difference in hours
    const timeDiffHours = Math.abs(newTime.getTime() - originalTime.getTime()) / (1000 * 60 * 60);
    
    // Determine if it's weekend/holiday
    const isWeekend = newTime.getDay() === 0 || newTime.getDay() === 6;
    const isHoliday = this.isHoliday(newTime);
    
    // Calculate hourly rate with multipliers
    let hourlyRate = this.pricingRules.baseHourlyRate;
    if (isHoliday) {
      hourlyRate *= this.pricingRules.holidayMultiplier;
    } else if (isWeekend) {
      hourlyRate *= this.pricingRules.weekendMultiplier;
    }
    
    // Calculate additional hours (minimum 1 hour for any time change)
    const additionalHours = Math.max(timeDiffHours, 1);
    
    const breakdown: CostBreakdown[] = [
      {
        category: 'time',
        description: `Time change: ${timeDiffHours.toFixed(1)} hours`,
        quantity: additionalHours,
        unitCost: hourlyRate,
        totalCost: additionalHours * hourlyRate,
        justification: `${isHoliday ? 'Holiday' : isWeekend ? 'Weekend' : 'Regular'} rate applied`
      }
    ];
    
    // Add minimum charge if applicable
    const totalCost = Math.max(
      additionalHours * hourlyRate,
      this.pricingRules.minimumCharges.timeChange
    );
    
    return {
      additionalHours,
      hourlyRate,
      travelCosts: 0,
      equipmentCosts: 0,
      vendorCosts: 0,
      totalAmount: totalCost,
      breakdown,
      confidence: 0.9
    };
  }

  /**
   * Calculate costs for location changes
   */
  private async calculateLocationCosts(changeOrder: ChangeOrder): Promise<CostImpact> {
    const originalLocation = changeOrder.originalValue;
    const newLocation = changeOrder.newValue;
    
    // Calculate travel distance (mock implementation)
    const travelDistance = await this.calculateTravelDistance(originalLocation, newLocation);
    const travelCosts = travelDistance * this.pricingRules.travelRates.local;
    
    // Additional setup time for new location
    const additionalHours = 1; // 1 hour for location scouting/setup
    const hourlyRate = this.pricingRules.baseHourlyRate;
    
    const breakdown: CostBreakdown[] = [
      {
        category: 'travel',
        description: `Travel to new location: ${travelDistance} miles`,
        quantity: travelDistance,
        unitCost: this.pricingRules.travelRates.local,
        totalCost: travelCosts,
        justification: 'IRS standard mileage rate'
      },
      {
        category: 'time',
        description: 'Additional setup time for new location',
        quantity: additionalHours,
        unitCost: hourlyRate,
        totalCost: additionalHours * hourlyRate,
        justification: 'Location scouting and setup time'
      }
    ];
    
    const totalCost = Math.max(
      travelCosts + (additionalHours * hourlyRate),
      this.pricingRules.minimumCharges.locationChange
    );
    
    return {
      additionalHours,
      hourlyRate,
      travelCosts,
      equipmentCosts: 0,
      vendorCosts: 0,
      totalAmount: totalCost,
      breakdown,
      confidence: 0.8
    };
  }

  /**
   * Calculate costs for equipment changes
   */
  private async calculateEquipmentCosts(changeOrder: ChangeOrder): Promise<CostImpact> {
    const addedEquipment = changeOrder.newValue; // Array of equipment items
    let equipmentCosts = 0;
    const breakdown: CostBreakdown[] = [];
    
    for (const equipment of addedEquipment) {
      const dailyRate = this.pricingRules.equipmentRates[equipment] || 50;
      equipmentCosts += dailyRate;
      
      breakdown.push({
        category: 'equipment',
        description: `Additional equipment: ${equipment}`,
        quantity: 1,
        unitCost: dailyRate,
        totalCost: dailyRate,
        justification: 'Daily equipment rental rate'
      });
    }
    
    const totalCost = Math.max(equipmentCosts, this.pricingRules.minimumCharges.equipmentAdd);
    
    return {
      additionalHours: 0,
      hourlyRate: this.pricingRules.baseHourlyRate,
      travelCosts: 0,
      equipmentCosts,
      vendorCosts: 0,
      totalAmount: totalCost,
      breakdown,
      confidence: 0.95
    };
  }

  /**
   * Calculate costs for personnel changes
   */
  private async calculatePersonnelCosts(changeOrder: ChangeOrder): Promise<CostImpact> {
    const additionalPersonnel = changeOrder.newValue;
    const hourlyRate = this.pricingRules.baseHourlyRate;
    const additionalHours = 8; // Assume 8-hour day
    
    const breakdown: CostBreakdown[] = [
      {
        category: 'time',
        description: `Additional personnel: ${additionalPersonnel}`,
        quantity: additionalHours,
        unitCost: hourlyRate,
        totalCost: additionalHours * hourlyRate,
        justification: 'Full day rate for additional photographer'
      }
    ];
    
    return {
      additionalHours,
      hourlyRate,
      travelCosts: 0,
      equipmentCosts: 0,
      vendorCosts: 0,
      totalAmount: additionalHours * hourlyRate,
      breakdown,
      confidence: 0.9
    };
  }

  /**
   * Calculate costs for travel changes
   */
  private async calculateTravelCosts(changeOrder: ChangeOrder): Promise<CostImpact> {
    const travelDetails = changeOrder.newValue;
    const travelCosts = travelDetails.isDestination 
      ? this.pricingRules.travelRates.destination * travelDetails.days
      : travelDetails.distance * this.pricingRules.travelRates.regional;
    
    const breakdown: CostBreakdown[] = [
      {
        category: 'travel',
        description: travelDetails.isDestination 
          ? `Destination wedding: ${travelDetails.days} days`
          : `Regional travel: ${travelDetails.distance} miles`,
        quantity: travelDetails.isDestination ? travelDetails.days : travelDetails.distance,
        unitCost: travelDetails.isDestination 
          ? this.pricingRules.travelRates.destination 
          : this.pricingRules.travelRates.regional,
        totalCost: travelCosts,
        justification: travelDetails.isDestination 
          ? 'Daily rate for destination weddings'
          : 'Regional mileage rate'
      }
    ];
    
    return {
      additionalHours: 0,
      hourlyRate: this.pricingRules.baseHourlyRate,
      travelCosts,
      equipmentCosts: 0,
      vendorCosts: 0,
      totalAmount: travelCosts,
      breakdown,
      confidence: 0.85
    };
  }

  /**
   * Calculate costs for scope changes
   */
  private async calculateScopeCosts(changeOrder: ChangeOrder): Promise<CostImpact> {
    const scopeChange = changeOrder.newValue;
    const additionalHours = scopeChange.estimatedHours || 2;
    const hourlyRate = this.pricingRules.baseHourlyRate;
    
    const breakdown: CostBreakdown[] = [
      {
        category: 'time',
        description: `Scope change: ${scopeChange.description}`,
        quantity: additionalHours,
        unitCost: hourlyRate,
        totalCost: additionalHours * hourlyRate,
        justification: 'Additional time for expanded scope'
      }
    ];
    
    return {
      additionalHours,
      hourlyRate,
      travelCosts: 0,
      equipmentCosts: 0,
      vendorCosts: 0,
      totalAmount: additionalHours * hourlyRate,
      breakdown,
      confidence: 0.7
    };
  }

  /**
   * Enhance cost calculation with AI analysis
   */
  private async enhanceCostCalculationWithAI(
    costImpact: CostImpact,
    changeOrder: ChangeOrder
  ): Promise<CostImpact> {
    try {
      const prompt = `
Analyze this photography change order and enhance the cost calculation:

Change Type: ${changeOrder.type}
Description: ${changeOrder.description}
Original Value: ${JSON.stringify(changeOrder.originalValue)}
New Value: ${JSON.stringify(changeOrder.newValue)}

Current Cost Calculation:
- Additional Hours: ${costImpact.additionalHours}
- Hourly Rate: $${costImpact.hourlyRate}
- Travel Costs: $${costImpact.travelCosts}
- Equipment Costs: $${costImpact.equipmentCosts}
- Total: $${costImpact.totalAmount}

Please review and suggest adjustments considering:
1. Industry standards for photography pricing
2. Complexity of the change
3. Market rates in the area
4. Hidden costs that might be missed

Return JSON with enhanced calculation:
{
  "adjustedTotal": <number>,
  "adjustmentReason": "explanation for any changes",
  "hiddenCosts": [
    {
      "category": "category",
      "description": "description",
      "amount": <number>,
      "justification": "why this cost applies"
    }
  ],
  "confidenceScore": <0-1>
}
`;

      const response = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${process.env.REACT_APP_OPENAI_API_KEY}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          model: 'gpt-4',
          messages: [
            {
              role: 'system',
              content: 'You are an expert in photography business pricing and cost analysis. Provide realistic, fair pricing adjustments.'
            },
            {
              role: 'user',
              content: prompt
            }
          ],
          temperature: 0.3,
          max_tokens: 600
        })
      });

      if (!response.ok) {
        console.warn('AI cost enhancement failed, using original calculation');
        return costImpact;
      }

      const data = await response.json();
      const enhancement = JSON.parse(data.choices[0].message.content);
      
      // Apply AI enhancements
      const enhancedBreakdown = [...costImpact.breakdown];
      
      // Add hidden costs identified by AI
      if (enhancement.hiddenCosts && enhancement.hiddenCosts.length > 0) {
        enhancement.hiddenCosts.forEach((hiddenCost: any) => {
          enhancedBreakdown.push({
            category: hiddenCost.category as CostBreakdown['category'],
            description: hiddenCost.description,
            quantity: 1,
            unitCost: hiddenCost.amount,
            totalCost: hiddenCost.amount,
            justification: hiddenCost.justification
          });
        });
      }
      
      return {
        ...costImpact,
        totalAmount: enhancement.adjustedTotal || costImpact.totalAmount,
        breakdown: enhancedBreakdown,
        confidence: enhancement.confidenceScore || costImpact.confidence
      };
      
    } catch (error) {
      console.warn('AI cost enhancement failed:', error);
      return costImpact;
    }
  }

  /**
   * Create micro-deposit for approved change order
   */
  async createMicroDeposit(changeOrder: ChangeOrder): Promise<MicroDeposit> {
    try {
      const costImpact = changeOrder.costImpact;
      
      // Determine deposit amount based on thresholds
      let depositAmount = costImpact.totalAmount;
      
      if (costImpact.totalAmount > this.pricingRules.thresholds.requireFullPayment) {
        // Require full payment for large changes
        depositAmount = costImpact.totalAmount;
      } else if (costImpact.totalAmount > this.pricingRules.thresholds.requireDeposit) {
        // Require 50% deposit for medium changes
        depositAmount = Math.round(costImpact.totalAmount * 0.5);
      } else if (costImpact.totalAmount <= this.pricingRules.thresholds.autoApprove) {
        // No deposit required for small changes
        return this.createCompletedDeposit(changeOrder, 0);
      }
      
      // Create Stripe Payment Intent
      const paymentIntent = await this.createStripePaymentIntent(depositAmount, changeOrder);
      
      const microDeposit: MicroDeposit = {
        id: `md_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        changeOrderId: changeOrder.id,
        amount: depositAmount,
        currency: 'USD',
        status: 'pending',
        paymentMethod: 'card',
        stripePaymentIntentId: paymentIntent.id,
        createdAt: new Date()
      };
      
      return microDeposit;
      
    } catch (error) {
      console.error('Error creating micro-deposit:', error);
      throw new Error(`Failed to create micro-deposit: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  /**
   * Create Stripe Payment Intent
   */
  private async createStripePaymentIntent(amount: number, changeOrder: ChangeOrder): Promise<any> {
    const amountInCents = Math.round(amount * 100);
    
    const response = await fetch('https://api.stripe.com/v1/payment_intents', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${this.stripeApiKey}`,
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      body: new URLSearchParams({
        amount: amountInCents.toString(),
        currency: 'usd',
        'metadata[change_order_id]': changeOrder.id,
        'metadata[job_id]': changeOrder.jobId,
        'metadata[client_id]': changeOrder.clientId,
        description: `Change order: ${changeOrder.description}`
      })
    });
    
    if (!response.ok) {
      throw new Error(`Stripe API error: ${response.status}`);
    }
    
    return await response.json();
  }

  /**
   * Create completed deposit for auto-approved changes
   */
  private createCompletedDeposit(changeOrder: ChangeOrder, amount: number): MicroDeposit {
    return {
      id: `md_auto_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      changeOrderId: changeOrder.id,
      amount,
      currency: 'USD',
      status: 'completed',
      paymentMethod: 'card',
      createdAt: new Date(),
      paidAt: new Date()
    };
  }

  /**
   * Process change order workflow
   */
  async processChangeOrder(changeOrder: ChangeOrder): Promise<{
    approved: boolean;
    requiresDeposit: boolean;
    microDeposit?: MicroDeposit;
    message: string;
  }> {
    try {
      // Step 1: Analyze cost impact
      const costImpact = await this.analyzeChangeOrder(changeOrder);
      changeOrder.costImpact = costImpact;
      
      // Step 2: Determine approval workflow
      if (costImpact.totalAmount <= this.pricingRules.thresholds.autoApprove) {
        // Auto-approve small changes
        changeOrder.status = 'approved';
        changeOrder.approvedAt = new Date();
        changeOrder.approvedBy = 'system';
        
        return {
          approved: true,
          requiresDeposit: false,
          message: `Change order auto-approved. No additional cost (under $${this.pricingRules.thresholds.autoApprove}).`
        };
      }
      
      // Step 3: Create micro-deposit for larger changes
      const microDeposit = await this.createMicroDeposit(changeOrder);
      changeOrder.microDeposit = microDeposit;
      changeOrder.status = 'pending';
      
      const requiresFullPayment = costImpact.totalAmount > this.pricingRules.thresholds.requireFullPayment;
      
      return {
        approved: false,
        requiresDeposit: true,
        microDeposit,
        message: requiresFullPayment 
          ? `Change order requires full payment of $${costImpact.totalAmount} due to significant scope change.`
          : `Change order requires ${microDeposit.amount === costImpact.totalAmount ? 'full' : '50%'} deposit of $${microDeposit.amount}.`
      };
      
    } catch (error) {
      console.error('Error processing change order:', error);
      return {
        approved: false,
        requiresDeposit: false,
        message: `Error processing change order: ${error instanceof Error ? error.message : 'Unknown error'}`
      };
    }
  }

  /**
   * Handle payment webhook from Stripe
   */
  async handlePaymentWebhook(webhookData: any): Promise<void> {
    try {
      const { type, data } = webhookData;
      
      if (type === 'payment_intent.succeeded') {
        const paymentIntent = data.object;
        const changeOrderId = paymentIntent.metadata.change_order_id;
        
        // Update micro-deposit status
        await this.updateMicroDepositStatus(paymentIntent.id, 'completed');
        
        // Update change order status
        await this.updateChangeOrderStatus(changeOrderId, 'paid');
        
        console.log(`Payment completed for change order: ${changeOrderId}`);
      }
      
      if (type === 'payment_intent.payment_failed') {
        const paymentIntent = data.object;
        
        await this.updateMicroDepositStatus(paymentIntent.id, 'failed');
        
        console.log(`Payment failed for payment intent: ${paymentIntent.id}`);
      }
      
    } catch (error) {
      console.error('Error handling payment webhook:', error);
    }
  }

  /**
   * Update micro-deposit status
   */
  private async updateMicroDepositStatus(paymentIntentId: string, status: MicroDeposit['status']): Promise<void> {
    // In real implementation, update database
    console.log(`Updating micro-deposit status: ${paymentIntentId} -> ${status}`);
  }

  /**
   * Update change order status
   */
  private async updateChangeOrderStatus(changeOrderId: string, status: ChangeOrder['status']): Promise<void> {
    // In real implementation, update database
    console.log(`Updating change order status: ${changeOrderId} -> ${status}`);
  }

  /**
   * Calculate travel distance between two locations
   */
  private async calculateTravelDistance(origin: string, destination: string): Promise<number> {
    // Mock implementation - in real app, use Google Maps Distance Matrix API
    const mockDistances: Record<string, number> = {
      'same_city': 15,
      'nearby_city': 45,
      'regional': 120,
      'destination': 500
    };
    
    // Simple heuristic based on location names
    if (origin.toLowerCase().includes(destination.toLowerCase()) || 
        destination.toLowerCase().includes(origin.toLowerCase())) {
      return mockDistances.same_city;
    }
    
    return mockDistances.nearby_city; // Default to nearby city
  }

  /**
   * Check if date is a holiday
   */
  private isHoliday(date: Date): boolean {
    // Simple holiday check - in real implementation, use a holiday API
    const holidays = [
      '01-01', // New Year's Day
      '07-04', // Independence Day
      '12-25', // Christmas
      '11-28', // Thanksgiving (approximate)
    ];
    
    const dateString = `${(date.getMonth() + 1).toString().padStart(2, '0')}-${date.getDate().toString().padStart(2, '0')}`;
    return holidays.includes(dateString);
  }

  /**
   * Get default cost impact for unknown change types
   */
  private getDefaultCostImpact(): CostImpact {
    return {
      additionalHours: 1,
      hourlyRate: this.pricingRules.baseHourlyRate,
      travelCosts: 0,
      equipmentCosts: 0,
      vendorCosts: 0,
      totalAmount: this.pricingRules.baseHourlyRate,
      breakdown: [
        {
          category: 'time',
          description: 'General change order',
          quantity: 1,
          unitCost: this.pricingRules.baseHourlyRate,
          totalCost: this.pricingRules.baseHourlyRate,
          justification: 'Standard hourly rate for miscellaneous changes'
        }
      ],
      confidence: 0.5
    };
  }

  /**
   * Get pricing summary for client
   */
  getPricingSummary(): {
    baseRate: number;
    multipliers: Record<string, number>;
    minimumCharges: Record<string, number>;
    thresholds: Record<string, number>;
  } {
    return {
      baseRate: this.pricingRules.baseHourlyRate,
      multipliers: {
        weekend: this.pricingRules.weekendMultiplier,
        holiday: this.pricingRules.holidayMultiplier,
        overtime: this.pricingRules.overtimeMultiplier
      },
      minimumCharges: this.pricingRules.minimumCharges,
      thresholds: this.pricingRules.thresholds
    };
  }
}

export default MicroDepositService;
export type { 
  ChangeOrder, 
  CostImpact, 
  MicroDeposit, 
  CostBreakdown,
  PricingRules
};

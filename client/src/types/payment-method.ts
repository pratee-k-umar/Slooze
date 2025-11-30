export enum PaymentType {
  CREDIT_CARD = "credit_card",
  DEBIT_CARD = "debit_card",
  UPI = "upi",
  CASH = "cash",
}

export interface PaymentMethod {
  id: string;
  name: string;
  type: PaymentType;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

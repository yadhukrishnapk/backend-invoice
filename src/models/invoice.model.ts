import mongoose, { Document, Schema } from 'mongoose';
import { InvoiceItem, TotalItem } from '../types/invoice';

export interface InvoiceDocument extends Document {
  clientId?: string; 
  invoiceNumber: string;
  issueDate: Date;
  dueDate: Date;
  items: InvoiceItem[];
  totals: TotalItem[];
  createdAt: Date;
  updatedAt: Date;
}

const InvoiceItemSchema = new Schema({
  description: { type: String, required: true },
  quantity: { type: Number, required: true },
  unitPrice: { type: Number, required: true },
  total: { type: Number, required: true }
});

const TotalItemSchema = new Schema({
  label: { type: String, required: true },
  value: { type: String, required: true }
});

const InvoiceSchema = new Schema(
  {
    clientId: { type: String, required: false }, 
    invoiceNumber: { type: String, required: true, unique: true },
    issueDate: { type: Date, default: Date.now },
    dueDate: { type: Date, required: true },
    items: [InvoiceItemSchema],
    totals: [TotalItemSchema]
  },
  {
    timestamps: true
  }
);

export default mongoose.model<InvoiceDocument>('Invoice', InvoiceSchema);
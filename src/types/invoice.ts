export interface InvoiceItem {
    description: string;
    quantity: number;
    unitPrice: number;
    total?: number;
  }
  
  export interface TotalItem {
    label: string;
    value: string;
  }
  
  export interface InvoiceData {
    tableData: InvoiceItem[];
    totalData: TotalItem[];
  }
  
  export interface InvoiceInput {
    items: Omit<InvoiceItem, 'total'>[];
    taxRate?: number;
  }
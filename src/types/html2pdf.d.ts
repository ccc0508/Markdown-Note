declare module 'html2pdf.js' {
    interface Html2PdfOptions {
        margin?: number | number[];
        filename?: string;
        image?: { type?: string; quality?: number };
        html2canvas?: {
            scale?: number;
            useCORS?: boolean;
            logging?: boolean;
            backgroundColor?: string;
            [key: string]: any;
        };
        jsPDF?: {
            unit?: string;
            format?: string | number[];
            orientation?: 'portrait' | 'landscape';
            [key: string]: any;
        };
        pagebreak?: { mode?: string | string[] };
        [key: string]: any;
    }

    interface Html2PdfInstance {
        set(options: Html2PdfOptions): Html2PdfInstance;
        from(element: HTMLElement | string): Html2PdfInstance;
        save(): Promise<void>;
        toPdf(): Html2PdfInstance;
        get(type: string): Promise<any>;
    }

    function html2pdf(): Html2PdfInstance;
    export default html2pdf;
}

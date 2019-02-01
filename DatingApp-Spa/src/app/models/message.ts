export interface Message{
   id: number;
   senderId: number;
   senderPhotoUrl: string;
   senderKnownAs: string;
   recipientId: number;
   recipientKnownAs: string;
   recipientPhotoUrl: string;
   content: string;
   isRead: boolean;
   dateRead: Date;
   messageSent: Date;
}

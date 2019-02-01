export interface Message{
   id: number;
   senderId: number;
   senderPhotoUrl: string;
   senderKnownAs: string;
   recipientId: string;
   recipientKnownAs: string;
   recipientPhotoUrl: string;
   content: string;
   isRead: boolean;
   dateRead: Date;
   messageSent: Date;
}

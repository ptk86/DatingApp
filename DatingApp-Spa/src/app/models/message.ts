export interface Message{
   id: number;
   senderId: number;
   senderPhotoUrl: string;
   senderKnownAs: string;
   recipentId: string;
   recipentKnownAs: string;
   recipentPhotoUrl: string;
   content: string;
   isRead: boolean;
   dateRead: Date;
   messageSent: Date;
}

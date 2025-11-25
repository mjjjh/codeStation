import ScreenCrack from "@/components/Animation/ScreenCrack";

export interface FCObj { 
    broken: boolean; 
    clickable: boolean; 
    image: string
    width: number;
    height: number;
 }


export interface Emoji {
    id: number;
    emoji: string;
    name: string;
    component?: React.FC<FCObj>;
}



export const tabName = {
    common: '😊',
    magic: '🪄',
}

export const EmojiMap = {
    common: [
        {
            id: 0,
            emoji: '😊',
            name: 'happy',
        },
        {
            id: 1,
            emoji: '😂',
            name: 'laugh',
        },
        {
            id: 2,
            emoji: '😍',
            name: 'love',
        },
        {
            id: 3,
            emoji: '😎',
            name: 'cool',
        },
        {
            id: 4,
            emoji: '😢',
            name: 'sad',
        },
        {
            id: 5,
            emoji: '😡',
            name: 'angry',
        },
    ],
    magic: [
        {
            id: 0,
            emoji: 'A',
            name: 'magic A',
            component: ScreenCrack,
        },
       
    ],
}


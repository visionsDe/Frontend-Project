const initialState = {
    conversationListData: [],
    messageListData: {
        messages: []
    },
    loading: true
};

export const getConversationListData = (conversationData: any) => {
    return {
        type: "getConversations",
        payload: conversationData
    };
};

export const getMessagesData = (messagesData: any) => {
    return {
        type: "getMessages",
        payload: messagesData
    };
};

// New action for appending a message
export const appendMessage = (messageData: any) => {
    return {
        type: "appendMessage",
        payload: messageData
    };
};

export const clearMessagesData = () => {
    return {
        type: "clearMessages",
    };
};

const chatModuleReducer = (state = initialState, action: any) => {
    switch (action.type) {
        case "getConversations":
            return {
                ...state,
                conversationListData: action.payload,
                loading: false
            };
        case "getMessages":
            return {
                ...state,
                messageListData: action.payload,
                loading: false
            };
        case "appendMessage":
            return {
                ...state,
                messageListData: {
                    ...state.messageListData,
                    messages: [...state.messageListData.messages, action.payload]
                }
            };
        case "clearMessages":
            return {
                ...state,
                messageListData: { messages: [] }
            };
        default:
            return state;
    }
};

export default chatModuleReducer;

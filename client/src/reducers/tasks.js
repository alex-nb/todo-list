const initialState = {
    tasks: [],
    task: null,
    loading: true,
    error: null
};

export default function (state = initialState, action) {
    switch (action.type) {
        
        case 'TASKS_GET':
            return {
                ...state,
                loading: false,
                tasks: action.payload
            };

        case 'TASK_GET':
            return {
                ...state,
                loading: false,
                task: action.payload
            };

        case 'ADD_TASK':
            return {
                ...state,
                loading: false,
                tasks: [action.payload, ...state.tasks],
            };

        case 'UPDATE_TASK':
            return {
                ...state,
                loading: false,
                tasks: state.tasks.map(task =>
                    task._id === action.payload._id ? action.payload : task
                  ),
            };

        case 'DELETE_TASK':
            return {
                ...state,
                loading: false,
                tasks: state.tasks.filter(task => task._id !== action.payload),
            };
                
        case 'TASK_ERROR': 
            return {
                ...state,
                error: action.payload,
                loading: false
            };

        default:
            return state;
    }
}
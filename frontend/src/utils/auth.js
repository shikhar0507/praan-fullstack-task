// UserContext.js
import React, { createContext, useContext, useReducer } from 'react';

const UserContext = createContext();

const initialState = {
  user: null,
  isAuthenticated: localStorage.getItem('token') ? true : false,
};

const userReducer = (state, action) => {
  switch (action.type) {
    case 'LOGIN':
      return {
        ...state,
        user: action.payload,
        isAuthenticated: true,
      };
    case 'LOGOUT':
      return {
        ...state,
        user: null,
        isAuthenticated: false,
      };
    default:
      return state;
  }
};

const UserProvider = ({ children }) => {
  console.log(children)
  const [state, dispatch] = useReducer(userReducer, initialState);

  return (
    <UserContext.Provider value={{ state, dispatch }}>
      {children}
    </UserContext.Provider>
  );
};

const useUser = () => {
  const context = useContext(UserContext);
  console.log(context)
  if (!context) {
    return { state: {
      user: null,
      isAuthenticated: false
    }, dispatch: () => {} };
  }
  return context;
};

export { UserProvider, useUser };

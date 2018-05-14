import React from "react";

const SET_STATE = "Layout/SET_STATE";
const SET_ACTIVEKEY = "Layout/SET_ACTIVEKEY";
const ADD_TAB = "Layout/ADD_TAB";
const REMOVE_TAB = 'Layout/REMOVE_TAB';
const SWITCH_TAB = 'Layout/SWITCH_TAB';

const initialState = {
    panes: [],
    activeKey: ''
};

const  containsPane = (key, panes) => {
    for(let i=0; i<panes.length; i++) {
        if(key === panes[i].key) {
            return true;
        }
    }
    return false;
};

export const LayoutReducer = (state = initialState, action) =>{
    switch(action.type) {
        case SET_STATE:
            return action.payload;
        case SET_ACTIVEKEY:
            return {
                ...state,
                activeKey: action.payload
            };
        case ADD_TAB:
            const panes = state.panes;
            const {key, name, component} = action.payload;
            if(!containsPane(key, panes)){
                panes.push({ title: name, content: React.createElement(component), key: key });
            }
            return {
                panes: panes,
                activeKey: key,
            };
        default:
            return state;
    }
};

export const setState = (newState) =>{
    return {
        type: SET_STATE,
        payload: newState
    };
};

export const setActiveKey = (activekey) => {
    return {
        type: SET_ACTIVEKEY,
        payload: activekey
    }
};

export const addTabAction = (key, name, component) => {
    return {
        type: ADD_TAB,
        payload: {
            key: key,
            name: name,
            component: component,
        },
    }
};
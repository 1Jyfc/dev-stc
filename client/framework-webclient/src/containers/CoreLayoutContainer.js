import { connect } from 'react-redux'
import CoreLayout from 'layouts/CoreLayout'
import {setState,setActiveKey} from "../modules/ducks/Layout";
import React from "react";

function containsPane(key, panes)
{
    for(let i=0; i<panes.length; i++) {
        if(key === panes[i].key) {
            return true;
        }
    }
    return false;
};

const mapStateToProps = (state) => {
    console.log(state);
    return {
        modules: state.System.modules,
        panes: state.Layout.panes,
        activeKey: state.Layout.activeKey
    }
};

const mapDispatchToProps = (dispatch) => {
    return {
        addTab: (Panes, key, name, component) => {
            const panes = Panes;
            const activeKey = key;
            if(!containsPane(key, Panes)){
                panes.push({ title: name, content: React.createElement(component), key: activeKey });
            }
            dispatch(setState({ panes,activeKey }))
        },
        removeTab: (Panes, activekey, targetKey) => {
            let activeKey = activekey;
            let lastIndex = -1;
            const tmpPanes = Panes;
            tmpPanes.forEach((pane, i) => {
                if (pane.key === targetKey) {
                    lastIndex = i - 1;
                }
            });
            const panes = tmpPanes.filter(pane => pane.key !== targetKey);
            if (lastIndex >= 0 && activeKey === targetKey) {
                activeKey = panes[lastIndex].key;
            }
            dispatch(setState({ panes,activeKey }))
        },
        switchTab: (activekey) => dispatch(setActiveKey(activekey))
    }
};

export default connect(mapStateToProps, mapDispatchToProps)(CoreLayout);
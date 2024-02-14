import React, { Component } from 'react';
import './App.css';
import { GIFer } from 'components/GIFer';
import { create, draw, drawFlag, drawUrl } from './create';

class App extends Component {

    constructor(props){
        super(props);
        try{
            this.lang = navigator.language.toLowerCase().split('-')[0];
        } catch(_){}
        if(!['en', 'es'].includes(this.lang)){
            this.lang = 'en';
        }
    }

    render() {
        return (
            <GIFer
                appId="buon-appetito"
                loadingImageUrl={`${process.env.RESOURCES_URL}/buon_appetito.png`}
                sourceImageUrl="./buon_appetito.png"
                title='Buon Appetito'
                create={create}
                deps={[draw, drawFlag, drawUrl]}
                lang={this.lang}
                loadButtonText='Elegir&nbsp;bandera'
                defaultImgs={[
                    './lgtbiq.svg',
                    './estelada.svg',
                    './franco.svg'
                ]}
                
            />
        )
    }
}

export default App;

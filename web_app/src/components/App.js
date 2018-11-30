import React, { Component } from 'react';
import '../App.css';
import { Route, Switch } from 'react-router-dom'
import NoMatch from './NoMatch'
import Alert from 'react-s-alert';
import 'react-s-alert/dist/s-alert-default.css';
import 'react-s-alert/dist/s-alert-css-effects/slide.css';
import { connect } from 'react-redux'
import { withRouter } from 'react-router';

// web app
import AppStart from './web_app/AppStart'

import { library } from '@fortawesome/fontawesome-svg-core'
import {
  faStroopwafel,
  faCoffee,
  faLaugh,
  faEdit,
  faExpand,
  faUser,
  faSitemap,
  faGavel,
  faPlayCircle,
  faArrowRight,
  faArrowLeft,
  faChartBar,
  faChartLine,
  faRocket,
  faMicrophone,
  faMicrophoneSlash,
  faTrash,
  faPlay,
  faUpload,
  faThumbsUp,
  faThumbsDown,
} from '@fortawesome/free-solid-svg-icons'

library.add(
  faStroopwafel,
  faCoffee,
  faLaugh,
  faEdit,
  faExpand,
  faUser,
  faSitemap,
  faGavel,
  faPlayCircle,
  faArrowRight,
  faArrowLeft,
  faChartBar,
  faChartLine,
  faRocket,
  faMicrophone,
  faMicrophoneSlash,
  faTrash,
  faPlay,
  faUpload,
  faThumbsUp,
  faThumbsDown,
)

class App extends Component {

  componentDidMount() {

  }

  // render view
  render() {

    return (
      <div className="App">

        <Switch>

          <Route exact path='/' render={() => (
            <AppStart />
          )} />

          <Route exact path='/notfound' component={NoMatch} />

          <Route component={NoMatch} />

        </Switch>

        <Alert stack={{limit: 3}} />

      </div>
    );
  }
}


export default withRouter(connect( null, null )(App))

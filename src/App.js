import React, { Component } from 'react';
import './App.css';

class Search extends Component {
  SubmitSearch( e ){
    //TODO: break this api_key out into gitignored config... it's not super secret, and it's tied to a burner email account, but I wouldn't commit a "real" key to source control
    let giphy_api_key = "MjyngB2aisWiri41PzsIxafOaPetSp8L", 
        query = this.props.searchTerm,
        numberToSelectFrom = 42,
        //not just using offset here b/c if number of results < itemToUse... you get no image back
        requestUrl = `//api.giphy.com/v1/gifs/search?api_key=${giphy_api_key}&q=${query}&limit=${numberToSelectFrom}&offset=0&rating=G&lang=en`;
    
    fetch( requestUrl )
      .then( ( res ) => { return res.json() } )
      .then( ( body ) => {
        if( body ){
          //not just using offset here b/c if number of results < itemToUse... you get no image back, so use the 
          let count = body.pagination.count,
              itemToUse = Math.round( Math.random() * count );
          try {
            this.props.updateDisplayImageUrl( body.data[ itemToUse ].images.original.url ); 
          } catch (e ) {
            this.props.updateDisplayImageUrl( "//www.svgrepo.com/show/48137/sad-hand-drawn-face.svg" ); //TODO: better error handling
          }
          this.props.updateImageStyle( { display: "inline" } );
        } else {
          throw new Error( "invalid response" );
        }
      })
      .catch( ( err )=>{ 
        console.error( err );
      });
  }
  handleTextInputChange = ( e ) => {
    this.props.updateSearchTerm( e.target.value );
  }
  handleTextInputKeyPressed( e ) { //taken wholesale from https://stackoverflow.com/questions/39442419/reactjs-is-there-a-way-to-trigger-a-method-by-pressing-the-enter-key-inside
    let code = e.keyCode || e.which;
    if( code === 13 ) { //13 is the enter keycode
      return this.SubmitSearch( e );
    } 
  }
  handleTextInputClick( e ) {
    this.props.updateSearchTerm( "" );
  }
  handleButtonClick = ( e ) => {
    return this.SubmitSearch( e );
  }
  render() {
    let { searchTerm } = this.props;
    return (
      <div className = "Search">
        <input 
          type = "search"
          className = "searchBox"
          placeholder = "What is your heart's desire? Cats? Grumpy cats? Maru Cats?"
          onChange = { ( e ) => this.handleTextInputChange( e ) }
          onKeyPress = { ( e ) => this.handleTextInputKeyPressed( e ) }
          onClick = { ( e ) => this.handleTextInputClick( e ) }
          value = { searchTerm }
        />
        <input
          type = "button"
          className = "searchButton"
          value = "Internet, Fetch Me My Cat!"
          onClick = { ( e ) => this.handleButtonClick( e ) }
        />
      </div>
    )
  }
}

class Display extends Component {
  render() {
    //let { displayImageUrl, updateDisplayImageUrl, searchTerm, updateSearchTerm } = this.props;
    let { displayImageUrl, searchTerm, style } = this.props;
    return (
      <div className = "Display">
        <img
          className = "displayImg"
          src = { displayImageUrl }
          alt = { searchTerm }
          style = { style }
        />
      </div>
    );
  }
};

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      searchTerm: "",
      displayImageUrl: "",
      imageStyle: {
        display: "none"
      }
    };
  };
  //TODO: auto-generate these update props
  updateSearchTerm = ( term ) => {
    this.setState( {
      searchTerm: term
    } );
  };
  updateDisplayImageUrl = ( url ) => {
    this.setState( {
      displayImageUrl: url
    } );
  };
  updateImageStyle = ( styleObj ) => {
    this.setState( {
      imageStyle: styleObj
    } );
  };
  render() {
    return (
      <div className="App">
        <Search
          searchTerm={this.state.searchTerm}
          updateSearchTerm={this.updateSearchTerm}
          displayImageUrl={this.state.displayImageUrl}
          updateDisplayImageUrl={this.updateDisplayImageUrl}
          updateImageStyle={this.updateImageStyle}
        />
        <Display
          searchTerm={this.state.searchTerm}
          updateSearchTerm={this.updateSearchTerm}
          displayImageUrl={this.state.displayImageUrl}
          updateDisplayImageUrl={this.updateDisplayImageUrl}
          style={this.state.imageStyle}
        />
      </div>
    )
  }
}
export default App;

import React from 'react';
import './SearchBar.css';
import Spotify from '../../util/Spotify';


export class SearchBar extends React.Component {
  constructor(props) {
    super(props);
    this.handleSearch = this.handleSearch.bind(this);
    this.handleTermChange = this.handleTermChange.bind(this);
    this.handleSearchByEnterKey = this.handleSearchByEnterKey.bind(this);
  }

  handleSearch(event) {
    this.props.onSearch(this.state.term);
    event.preventDefault();
  }

  handleTermChange(event) {
    this.setState({
      term: event.target.value
    });
  }

  handleSearchByEnterKey(event) {
    if(event.keyCode === 13) {
      document.getElementById('btnSearch').click();
    }
  }

  componentDidMount() {
    /* fetches accessToken as soon as the SearchBar component is mounted and before it is rendered and a search term can be entered */
    Spotify.getAccessToken();
  }

  render() {
    return (
      <div className="SearchBar">
        <input placeholder="Enter A Song, Album, or Artist"
               onChange={this.handleTermChange}
               onKeyDown={this.handleSearchByEnterKey}/>
        <a id="btnSearch" onClick={this.handleSearch}>SEARCH</a>
      </div>
    );
  }
}

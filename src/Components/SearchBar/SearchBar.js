import React from 'react';
import './SearchBar.css';


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

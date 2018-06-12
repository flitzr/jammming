import React from 'react';
import './SearchBar.css';


export class SearchBar extends React.Component {
  constructor(props) {
    super(props);
    this.handleSearch = this.handleSearch.bind(this);
    this.handleTermChange = this.handleTermChange.bind(this);
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

  render() {
    return (
      <div className="SearchBar">
        <input placeholder="Enter A Song, Album, or Artist" onChange={this.handleTermChange}/>
        <a onClick={this.handleSearch}>SEARCH</a>
      </div>
    );
  }
}

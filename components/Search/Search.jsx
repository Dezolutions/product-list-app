import React from 'react'

const Search = () => {
  return (
    <div>
      <TextField
        value={email}
        onChange={onInput}
        type="email"
        placeholder="Find customer by email"
        autoComplete="off"
      />
      
    </div>
  )
}

export default Search

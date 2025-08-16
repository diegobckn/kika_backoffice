// eslint-disable-next-line no-unused-vars
import React, { useState } from 'react';
import { TextField, IconButton } from '@mui/material';
import { Search as SearchIcon } from '@mui/icons-material';

const Buscador2 = () => {
  const [searchValue, setSearchValue] = useState('');

  const handleSearch = () => {
    console.log('Search:', searchValue);
    // Perform search logic here
  };

  const handleInputChange = (e) => {
    setSearchValue(e.target.value);
  };

  return (
    <div style={{ display: 'flex', alignItems: 'center' }}>

        
      <TextField
        label="Buscador por código producto"
        variant="outlined"
        fullWidth
        value={searchValue}
        onChange={handleInputChange}
        sx={{ borderRadius: '24px', marginRight: '8px' }}
      />
      <IconButton
        onClick={handleSearch}
        color="primary"
        sx={{ borderRadius: '50%', p: 1 }}
      >
        <SearchIcon />
      </IconButton>
      
    </div>
  );
};

export default Buscador2;

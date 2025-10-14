import { useState, useEffect } from 'react';
import { TextField, Autocomplete, CircularProgress } from '@mui/material';
import axios from 'axios';

interface CitySelectProps {
  value: string;
  onChange: (city: string) => void;
  disabled?: boolean;
}

export default function CitySelect({ value, onChange, disabled = false }: CitySelectProps) {
  const [cities, setCities] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCities = async () => {
      try {
        const response = await axios.get('/api/cities');
        setCities(response.data);
      } catch (error) {
        console.error('Failed to fetch cities:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchCities();
  }, []);

  return (
    <Autocomplete
      value={value}
      onChange={(_, newValue) => onChange(newValue || '')}
      options={cities}
      loading={loading}
      disabled={disabled}
      renderInput={(params) => (
        <TextField
          {...params}
          label="Select City"
          variant="outlined"
          fullWidth
          InputProps={{
            ...params.InputProps,
            endAdornment: (
              <>
                {loading ? <CircularProgress color="inherit" size={20} /> : null}
                {params.InputProps.endAdornment}
              </>
            ),
          }}
        />
      )}
    />
  );
}
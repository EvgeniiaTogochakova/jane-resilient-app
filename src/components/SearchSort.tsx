import React from 'react';
import { Form, useSubmit } from 'react-router-dom';
import {
  TextField,
  InputAdornment,
  CircularProgress,
  Box,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
} from '@mui/material';

import type { SelectChangeEvent } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';

interface SearchSortProps {
  q: string;
  sort: string;
  searching: boolean;
}
export default function SearchSort({ q, sort, searching }: SearchSortProps) {
  const submit = useSubmit();

  const debounceTimeoutRef = React.useRef<ReturnType<typeof setTimeout> | null>(null);

  const handleSortChange = (event: SelectChangeEvent<string>) => {
    const form = document.getElementById('search-form') as HTMLFormElement | null;
    if (form) {
      const formData = new FormData(form);
      formData.set('sort', event.target.value);
      submit(formData);
    }
  };

  return (
    <Box
      component={Form}
      id="search-form"
      role="search"
      sx={{ display: 'flex', gap: 2, mb: 4, alignItems: 'center', mt: 1 }}>
      {/* Скрытый инпут сброса пагинации на 1 страницу */}
      <input type="hidden" name="page" value="1" />

      {/* Неконтролируемый инпут поиска */}
      <TextField
        id="q"
        name="q"
        label="Search users"
        variant="outlined"
        size="small"
        defaultValue={q} // по мотивам туториала React Router 6.28.0
        sx={{ flexGrow: 1 }}
        slotProps={{
          input: {
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon />
              </InputAdornment>
            ),
            endAdornment: searching ? (
              <InputAdornment position="end">
                <CircularProgress size={20} />
              </InputAdornment>
            ) : null,
          },
        }}
        onChange={(event) => {
          if (debounceTimeoutRef.current) {
            clearTimeout(debounceTimeoutRef.current);
          }

          const currentForm = event.currentTarget.form;

          // Читаем текущее значение прямо из URL
          const searchParams = new URLSearchParams(window.location.search);
          const isFirstSearch = !searchParams.has('q') || searchParams.get('q') === '';

          debounceTimeoutRef.current = setTimeout(() => {
            if (currentForm) {
              submit(currentForm, {
                // Если это самый первый символ в пустой строке — создаем новую запись в истории
                // Для всех последующих изменений внутри этой сессии поиска — строго перезаписываем
                replace: !isFirstSearch,
              });
            }
          }, 500);
        }}
      />

      {/* Неконтролируемый селект сортировки */}
      <FormControl size="small" sx={{ minWidth: 150 }}>
        <InputLabel id="sort-label">Sort By</InputLabel>
        <Select
          labelId="sort-label"
          id="sort"
          name="sort"
          key={sort} // Заставляем MUI перерисовать селект, если изменился URL (например, нажали "Назад")
          defaultValue={sort} // по мотивам туториала React Router 6.28.0
          label="Sort By"
          onChange={handleSortChange}>
          <MenuItem value="name">Name (A-Z)</MenuItem>
          <MenuItem value="-name">Name (Z-A)</MenuItem>
          <MenuItem value="city">City</MenuItem>
          <MenuItem value="email">Email</MenuItem>
        </Select>
      </FormControl>
    </Box>
  );
}

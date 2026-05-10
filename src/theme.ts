import { createTheme } from '@mui/material/styles';

const theme = createTheme({
  palette: {
    primary: {
      main: '#4E5E07',
    },
    secondary: {
      main: '#E19D29',
    },

    action: {
      active: '#4C2F27',
    },
  },
  // components: {
  //   // Находим нужный компонент в "матрешке"
  //   MuiTextField: {
  //     defaultProps: {
  //       variant: 'outlined', // Теперь все инпуты по умолчанию будут outlined
  //       margin: 'normal', // И с нормальными отступами
  //     },
  //   },
  //   MuiOutlinedInput: {
  //     styleOverrides: {
  //       root: {
  //         borderRadius: '12px', // Делаем все поля скругленными
  //         '&:hover .MuiOutlinedInput-notchedOutline': {
  //           borderColor: '#E19D29', // Оранжевая рамка при наведении для всех полей
  //         },
  //       },
  //     },
  //   },
  // },
});

export default theme;

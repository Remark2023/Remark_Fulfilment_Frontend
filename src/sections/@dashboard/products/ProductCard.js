import PropTypes from 'prop-types';
// @mui
import { Box, Card, Stack, Typography } from '@mui/material';
import { styled } from '@mui/material/styles';
// utils
// components

// ----------------------------------------------------------------------

const StyledProductImg = styled('img')({
  top: 0,
  width: '100%',
  height: '100%',
  objectFit: 'cover',
  position: 'absolute',
});

// ----------------------------------------------------------------------

ShopProductCard.propTypes = {
  product: PropTypes.object,
};

export default function ShopProductCard({ product }) {
  const { title, cover, subtitle } = product;
  const name = 'mamun chowdhury';

  return (
    <Card style={{ padding: '35px', minHeight: '355px', cursor: 'pointer' }}>
      <Box sx={{ pt: '100%', position: 'relative' }}>
        <StyledProductImg alt={name} src={cover} />
      </Box>

      <Stack spacing={3} sx={{ p: 3 }} style={{ textAlign: 'center' }}>
        <Typography variant="subtitle1" noWrap>
          {title}
        </Typography>

        <Stack>
          <Typography variant="subtitle2">{subtitle}</Typography>
        </Stack>
      </Stack>
    </Card>
  );
}

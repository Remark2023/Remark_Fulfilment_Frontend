import PropTypes from 'prop-types';
import { useEffect, useState } from 'react';
// @mui
import { Avatar, Box, Button, Card, CardContent, Grid, Link, Typography } from '@mui/material';
import { alpha, styled, useTheme } from '@mui/material/styles';
// utils
//
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import useMediaQuery from '@mui/material/useMediaQuery';
import { addBlogReadService, getLikeCount, getLikedBlogDetails, getReadCount, likeBlogService } from '../../../Services/ApiServices';
import Iconify from '../../../components/iconify';
import SvgColor from '../../../components/svg-color';
import { fShortenNumber } from '../../../utils/formatNumber';
import { fDate } from '../../../utils/formatTime';

// ----------------------------------------------------------------------

const StyledCardMedia = styled('div')({
  position: 'relative',
  paddingTop: 'calc(100% * 3 / 4)',
});

const StyledTitle = styled(Link)({
  height: 44,
  overflow: 'hidden',
  WebkitLineClamp: 2,
  display: '-webkit-box',
  WebkitBoxOrient: 'vertical',
});

const StyledAvatar = styled(Avatar)(({ theme }) => ({
  zIndex: 9,
  width: 32,
  height: 32,
  position: 'absolute',
  left: theme.spacing(3),
  bottom: theme.spacing(-2),
}));

const StyledInfo = styled('div')(({ theme }) => ({
  display: 'flex',
  flexWrap: 'wrap',
  justifyContent: 'flex-end',
  marginTop: theme.spacing(3),
  color: theme.palette.text.disabled,
}));

const StyledCover = styled('img')({
  top: 0,
  width: '100%',
  height: '100%',
  objectFit: 'cover',
  position: 'absolute',
});

// ----------------------------------------------------------------------

BlogPostCard.propTypes = {
  post: PropTypes.object.isRequired,
  index: PropTypes.number,
};

export default function BlogPostCard({ post, index }) {
  const { blogid, authorName, authorPhoto, title, cover, postdate, content, like, read } = post;
  const latestPostLarge = index === 0;
  const latestPost = index === 1 || index === 2;

  const authorPhotoUrl = `/assets/images/dp/${authorPhoto}`;
  const coverUrl = cover ? `/assets/images/covers/${cover}` : '/assets/images/covers/cover_21.jpg';

  const [open, setOpen] = useState(false);
  const [readCount, setReadCount] = useState(0);

  useEffect(() => {
    async function fetchData() {
      try {
        const counts = await getReadCount(blogid);
        if (counts.status === 200) setReadCount(counts.data.count);
      } catch (error) {
        console.error('Error fetching account details:', error);
      }
    }

    fetchData();
  }, []);

  const [likeCount, setLikeCount] = useState(0);

  useEffect(() => {
    async function fetchData() {
      try {
        const counts = await getLikeCount(blogid);
        if (counts.status === 200) setLikeCount(counts.data.count);
      } catch (error) {
        console.error('Error fetching account details:', error);
      }
    }

    fetchData();
  }, []);

  const [likeDetails, setLikeDetails] = useState('');

  useEffect(() => {
    async function fetchData() {
      try {
        const like = await getLikedBlogDetails(blogid);
        if (like.status === 200) setLikeDetails(like.data.displaytext ? like.data.displaytext : 'Like');
      } catch (error) {
        console.error('Error fetching account details:', error);
      }
    }

    fetchData();
  }, []);

  const POST_INFO = [
    { number: readCount, icon: 'eva:eye-fill' },
    { number: likeCount, icon: 'icon-park-solid:like' },
  ];

  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down('md'));

  const handleClickOpen = async () => {
    setOpen(true);
    const response = await addBlogReadService(blogid);

    console.log(response.data);
  };

  const handleClose = () => {
    setOpen(false);
    window.location.reload();
  };

  const likeBlog = async () => {
    const response = await likeBlogService(blogid);
    console.log(response.data);

    const like = await getLikedBlogDetails(blogid);
    if (like.status === 200) setLikeDetails(like.data.displaytext ? like.data.displaytext : 'Like');
  };

  return (
    <Grid item xs={12} sm={latestPostLarge ? 12 : 6} md={latestPostLarge ? 6 : 3}>
      <Card sx={{ position: 'relative' }}>
        <StyledCardMedia
          sx={{
            ...((latestPostLarge || latestPost) && {
              pt: 'calc(100% * 4 / 3)',
              '&:after': {
                top: 0,
                content: "''",
                width: '100%',
                height: '100%',
                position: 'absolute',
                bgcolor: (theme) => alpha(theme.palette.grey[900], 0.72),
              },
            }),
            ...(latestPostLarge && {
              pt: {
                xs: 'calc(100% * 4 / 3)',
                sm: 'calc(100% * 3 / 4.66)',
              },
            }),
          }}
        >
          <SvgColor
            color="paper"
            src="/assets/icons/shape-avatar.svg"
            sx={{
              width: 80,
              height: 36,
              zIndex: 9,
              bottom: -15,
              position: 'absolute',
              color: 'background.paper',
              ...((latestPostLarge || latestPost) && { display: 'none' }),
            }}
          />
          <StyledAvatar
            alt={authorName}
            src={authorPhotoUrl}
            sx={{
              ...((latestPostLarge || latestPost) && {
                zIndex: 9,
                top: 24,
                left: 24,
                width: 40,
                height: 40,
              }),
            }}
          />

          <StyledCover alt={title} src={coverUrl} />
          {/* <StyledCover alt={title} src={'/assets/images/covers/cover_1.jpg'} /> */}
        </StyledCardMedia>

        <CardContent
          sx={{
            pt: 4,
            ...((latestPostLarge || latestPost) && {
              bottom: 0,
              width: '100%',
              position: 'absolute',
            }),
          }}
          style={{ cursor: 'pointer' }}
          onClick={handleClickOpen}
        >
          <Typography gutterBottom variant="caption" sx={{ color: 'text.disabled', display: 'block' }}>
            {/* {fDate('10/16/2023')} */}
            {fDate(postdate)}
          </Typography>

          <StyledTitle
            color="inherit"
            variant="subtitle2"
            underline="hover"
            sx={{
              ...(latestPostLarge && { typography: 'h5', height: 60 }),
              ...((latestPostLarge || latestPost) && {
                color: 'common.white',
              }),
            }}
          >
            {title}
          </StyledTitle>

          <StyledInfo>
            {POST_INFO.map((info, index) => (
              <Box
                key={index}
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  ml: index === 0 ? 0 : 1.5,
                  ...((latestPostLarge || latestPost) && {
                    color: 'grey.500',
                  }),
                }}
              >
                <Iconify icon={info.icon} sx={{ width: 16, height: 16, mr: 0.5 }} />
                <Typography variant="caption">{fShortenNumber(info.number)}</Typography>
              </Box>
            ))}
          </StyledInfo>
        </CardContent>
        <Dialog
          fullScreen={fullScreen}
          open={open}
          onClose={handleClose}
          scroll={'paper'}
          aria-labelledby="responsive-dialog-title"
        >
          {/* <Button
            aria-label="close"
            onClick={handleClose}
            sx={{
              position: 'absolute',
              right: 0,
              top: 11,
              color: (theme) => theme.palette.grey[500],
            }}
          >
            <Iconify icon={'mdi:close-box'} sx={{ width: 30, height: 30, mr: 0.5 }} />
          </Button> */}
          <DialogTitle id="responsive-dialog-title" style={{ marginRight: '80px' }}>
            {title}
          </DialogTitle>
          <DialogContent>
            <DialogContentText>{content}</DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button autoFocus onClick={handleClose}>
              Close
            </Button>
            <Button autoFocus onClick={likeBlog}>
              {likeDetails}
            </Button>
          </DialogActions>
        </Dialog>
      </Card>
    </Grid>
  );
}

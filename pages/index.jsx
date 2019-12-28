import React from 'react';
import Container from '@material-ui/core/Container';
import Typography from '@material-ui/core/Typography';
import Box from '@material-ui/core/Box';
import { makeStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import axios from 'axios';
import Router from 'next/router';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import Button from '@material-ui/core/Button';
import ChipInput from 'material-ui-chip-input';
import Card from '@material-ui/core/Card';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import TextField from '@material-ui/core/TextField';
import CircularProgress from '@material-ui/core/CircularProgress';
import Snackbar from '@material-ui/core/Snackbar';
import SnackbarContent from '@material-ui/core/SnackbarContent';

const useStyles = makeStyles(theme => ({
    root: {
        flexGrow: 1,
    },
    paper: {
        height: 140,
        width: 100,
    },
    control: {
        padding: theme.spacing(2),
    },
    list: { backgroundColor: theme.palette.background.paper },
    inline: {
        display: 'inline',
    },
    card: {
        marginBottom: '20px',
        width: '50%',
        marginLeft: '24%',
    },
    info: {
        backgroundColor: theme.palette.primary.main,
    },
}));

export default function Index() {
    const [isLoading, setLoading] = React.useState(true);
    const [state, setState] = React.useState({
        tweets: [],
        user: { topLinks: [], topUsers: [] },
        isNewUser: false,
    });
    const [filterParams, setFilters] = React.useState({
        hashTags: [],
        location: '',
    });

    const classes = useStyles();

    const logOut = async () => {
        try {
            await axios.delete('/api/v1/auth/logout');
        } catch (err) {
            console.error(err);
        } finally {
            Router.push('/login');
        }
    };

    const loadData = async () => {
        setLoading(true);
        try {
            const { data } = await axios.post('/api/v1/tweets', {
                ...filterParams,
            });
            console.log(data);
            setState(data);
            setLoading(false);
        } catch (err) {
            console.error(err);
            return Router.push('/login');
        }
    };

    const handleFilters = ({ hashTags, location }) => {
        const filtersObj = {};
        filtersObj.hashTags = hashTags || filterParams.hashTags;
        filtersObj.location = location || filterParams.location;
        setFilters(filtersObj);
        // loadData();
    };

    React.useEffect(() => {
        loadData();
    }, []);

    return (
        <Container>
            <Box my={4}>
                <Typography variant="h4" component="h1" gutterBottom>
                    Hello, {state.user.twitterUserName}, Your Twitter Account
                    Details:{' '}
                    <Button
                        style={{ float: 'right' }}
                        variant="contained"
                        color="primary"
                        onClick={logOut}
                    >
                        Logout
                    </Button>
                </Typography>
            </Box>
            {state.isNewUser ? (
                <Snackbar
                    anchorOrigin={{
                        vertical: 'top',
                        horizontal: 'right',
                    }}
                    open={true}
                    autoHideDuration={2000}
                >
                    <SnackbarContent
                        className={classes.info}
                        message={
                            <span
                                id="client-snackbar"
                                className={classes.message}
                            >
                                Please Refresh this page to see the latest
                                tweets, as we process your tweets in the
                                background.
                            </span>
                        }
                    />
                </Snackbar>
            ) : (
                ''
            )}
            <Card className={classes.card}>
                <CardContent>
                    <Typography color="textSecondary" gutterBottom>
                        Filter Tweets
                    </Typography>
                    <Container>
                        <Typography color="textSecondary" gutterBottom>
                            Filter By HashTags
                        </Typography>
                        <ChipInput
                            placeholder="Enter to Add a Hashtag"
                            onChange={hashTags => handleFilters({ hashTags })}
                        />
                        <br />
                        <br />
                        <Typography color="textSecondary" gutterBottom>
                            Filter By Location
                        </Typography>
                        <TextField
                            label="Location"
                            onChange={e =>
                                handleFilters({ location: e.target.value })
                            }
                        />
                    </Container>
                </CardContent>
                <CardActions>
                    <Button
                        size="small"
                        variant="contained"
                        color="primary"
                        onClick={loadData}
                    >
                        Filter Tweets
                    </Button>
                </CardActions>
            </Card>

            {isLoading ? (
                <CircularProgress
                    size={40}
                    left={-20}
                    top={10}
                    status={'loading'}
                    style={{ marginLeft: '50%', marginTop: '10%' }}
                    color="secondary"
                />
            ) : (
                <Grid container className={classes.root}>
                    <Grid item xs={2}>
                        Top Users
                        <List className={classes.list}>
                            {state.user.topUsers.map((userArr, index) => {
                                return (
                                    <ListItem
                                        alignItems="flex-start"
                                        key={index}
                                    >
                                        <ListItemText
                                            primary={userArr[0]}
                                            secondary={
                                                <React.Fragment>
                                                    <Typography
                                                        component="span"
                                                        variant="body2"
                                                        className={
                                                            classes.inline
                                                        }
                                                        color="textPrimary"
                                                    >
                                                        {/* {tweet.user.name} */}
                                                    </Typography>
                                                    {` Shared ${userArr[1]} Links`}
                                                </React.Fragment>
                                            }
                                        />
                                    </ListItem>
                                );
                            })}
                        </List>
                    </Grid>
                    <Grid item xs={8}>
                        Tweets
                        <List className={classes.list}>
                            {state.tweets.map((tweet, index) => {
                                return (
                                    <ListItem
                                        alignItems="flex-start"
                                        key={index}
                                    >
                                        <ListItemText
                                            primary={tweet.text}
                                            secondary={
                                                <React.Fragment>
                                                    <Typography
                                                        component="span"
                                                        variant="body2"
                                                        className={
                                                            classes.inline
                                                        }
                                                        color="textPrimary"
                                                    >
                                                        {tweet.user.name}
                                                    </Typography>
                                                    {` On ${new Date(
                                                        tweet.created_at
                                                    ).toLocaleString()}`}
                                                </React.Fragment>
                                            }
                                        />
                                    </ListItem>
                                );
                            })}
                        </List>
                    </Grid>
                    <Grid item xs={2}>
                        Top Links
                        <List className={classes.list}>
                            {state.user.topLinks.map((linkArr, index) => {
                                return (
                                    <ListItem
                                        alignItems="flex-start"
                                        key={index}
                                    >
                                        <ListItemText
                                            primary={linkArr[0]}
                                            secondary={
                                                <React.Fragment>
                                                    <Typography
                                                        component="span"
                                                        variant="body2"
                                                        className={
                                                            classes.inline
                                                        }
                                                        color="textPrimary"
                                                    >
                                                        {/* {tweet.user.name} */}
                                                    </Typography>
                                                    {` has been shared ${linkArr[1]} times.`}
                                                </React.Fragment>
                                            }
                                        />
                                    </ListItem>
                                );
                            })}
                        </List>
                    </Grid>
                </Grid>
            )}
        </Container>
    );
}

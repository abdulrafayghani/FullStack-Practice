import React, { useState } from "react"
import { useMutation, useQuery } from "@apollo/client"
import gql from "graphql-tag"
import BookmarkIcon from '@material-ui/icons/Bookmark';
import { Box, Button, makeStyles, TextField } from "@material-ui/core"
import List from "@material-ui/core/List"
import ListItem from "@material-ui/core/ListItem"
import ListItemAvatar from "@material-ui/core/ListItemAvatar"
import ListItemSecondaryAction from "@material-ui/core/ListItemSecondaryAction"
import ListItemText from "@material-ui/core/ListItemText"
import Avatar from "@material-ui/core/Avatar"
import IconButton from "@material-ui/core/IconButton"
import DeleteIcon from "@material-ui/icons/Delete"
import Grid from "@material-ui/core/Grid"
import Typography from "@material-ui/core/Typography"

const BookMarksQuery = gql`{
  bookmark{
    url
    desc
    id
  }
}
`
const AddBookmarkMutation = gql`
  mutation addBookmark($url: String!, $desc: String!){
    addBookmark(url: $url, desc: $desc){
      url
    }
  }
`

const deleteBookMark = gql `
  mutation deleteBookmark($id: String!) {
    deleteBookmark(id: $id){
      id
    }
  }
` 

const useStyles = makeStyles(theme => ({
  root: {
    textAlign: "center",
    marginTop: "100px",
  },
  demo: {
    backgroundColor: theme.palette.background.paper,
  },
  title: {
    margin: theme.spacing(4, 0, 2),
  },
}))

export default function Home() {
  const { loading, data } = useQuery(BookMarksQuery)
  const [ addBookmark, { loading: adding } ]   = useMutation(AddBookmarkMutation)
  const [ removeBookmark, { loading: deleting } ]   = useMutation(deleteBookMark)

  const [ url, setUrl ]  = useState('')
  const [ desc, setDesc ]  = useState('')
  
  const classes = useStyles()

  if(loading){
    return <h1>...loading</h1>
  }

  const addBookmarkSubmit = async () => {
    await addBookmark({
      variables: {
        url, 
        desc
      },
      refetchQueries: [{query: BookMarksQuery}]
    })
    setUrl("")
    setDesc("")
  }

  const handleDelete = async (id) => {
    console.log(id)
    await removeBookmark({
      variables: { id },
      refetchQueries: [{query: BookMarksQuery}]
    })
  }
  
  return (   
  <div className={classes.root}>
    <h1> BookMark App </h1>
    <div style={{ display: "flex", justifyContent: "center" }}>
      <Box width="55%">
        <TextField
          fullWidth
          value={url}
          variant="outlined"
          label="Add Url"
          onChange={e => setUrl(e.target.value)}
        />
        <TextField
        style={{marginTop: '15px'}}
          fullWidth
          value={desc}
          variant="outlined"
          label="Add Desc"
          onChange={e => setDesc(e.target.value)}
        />
      </Box>
      <Button onClick={addBookmarkSubmit}>Add Bookmark</Button>
      {adding && <p style={{fontWeight : "bold"}}>adding data ...</p>}
    </div>
    <div style={{ display: "flex", justifyContent: "center" }}>
      <Grid item xs={12} md={6}>
        <Typography variant="h6" className={classes.title}></Typography>
        <div className={classes.demo}>
          <List>
            {data.bookmark.map(item => {
              return (
                <ListItem key={item.id}>
                  <ListItemAvatar>
                    <Avatar>
                      <BookmarkIcon />
                    </Avatar>
                  </ListItemAvatar>
                  <ListItemText> url: {item.url} </ListItemText>
                  <ListItemText > desc: {item.desc} </ListItemText>
                  <ListItemSecondaryAction>
                    <IconButton edge="end" aria-label="delete" onClick={() => {handleDelete(item.id)}} >
                      <DeleteIcon />
                    </IconButton>
                  </ListItemSecondaryAction>
                </ListItem>
              )
            })}
          </List>
          {deleting && <p style={{fontWeight : "bold"}}>removing data ...</p>}
        </div>
      </Grid>
    </div>
  </div>


  )
}

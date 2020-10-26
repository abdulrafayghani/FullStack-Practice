import React, { useState } from "react"
import { useMutation, useQuery } from "@apollo/client"
import gql from "graphql-tag"

const BookMarksQuery = gql`{
    bookmark {
       url
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

export default function Home() {
  const { loading, data } = useQuery(BookMarksQuery)
  const [ addBookmark ]   = useMutation(AddBookmarkMutation)
  const [ url, setUrl ]  = useState('')
  const [ desc, setDesc ]  = useState('')

  console.log(url)

  if(loading){
    return <h1>...loading</h1>
  }

  console.log(data)

  const addBookmarkSubmit = () => {
    addBookmark({
      variables: {
        url, 
        desc
      },
      refetchQueries: [{query: BookMarksQuery}]
    })
  }
  
  return (
    <div>
      <p>{JSON.stringify(data)}</p>
      <input type='text' placeholder='url'  onChange={(event) => setUrl(event.target.value)} />
      <input type='text' placeholder='desc'  onChange={(event) => setDesc(event.target.value)} />
      <button onClick={addBookmarkSubmit}>submit</button>
    </div>
  )
}

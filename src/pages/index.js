import React from "react"
import { useMutation, useQuery } from "@apollo/client"
import gql from "graphql-tag"

const BookMarksQuery = gql`
  {
    bookmark {
       url
    }
  }
`
const AddBookmarkMutation = gql`
  mutation addBookmark($url: String, $desc: String){
    addBookmark(url: $url, desc: $desc){
      url
    }
  }
`

// const AddBookmarkMutation = gql`
//   mutation addBookmark{
//       url
//   }
// `

export default function Home() {
  const { loading, error, data } = useQuery(BookMarksQuery)
  const { addBookmark } = useMutation(AddBookmarkMutation)

  if(loading){
    return <h1>...loading</h1>
  }

  console.log(data)
  
  return (
    <div>
      {" "}
      {/* hello */}
      <p>{JSON.stringify(data)}</p>
      <form>
      <input></input>
      <button type='submit' onClick={() => addBookmark}></button>
      </form>
    </div>
  )
}

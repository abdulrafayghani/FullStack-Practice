import React from "react"
import { useQuery, useMutation } from "@apollo/client"
import gql from "graphql-tag"

const BookMarksQuery = gql`
  {
    bookmark {
       url
    }
  }
`

export default function Home() {
  const { loading, error, data } = useQuery(BookMarksQuery)
  console.log(data)

  return (
    <div>
      {" "}
      {/* hello */}
      <p>{JSON.stringify(data)}</p>
    </div>
  )
}

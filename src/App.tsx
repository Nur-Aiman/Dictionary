import { useState } from 'react'
import './App.css'

type DefinitionType = null | any

function Definition({ data }: { data: DefinitionType }) {
  if (!data) {
    return null
  }

  return (
    <div>
      {data.map((item: any) => (
        <div className='container'>
          <div key={item.word} className='definition'>
            <h2>Word: {item.word}</h2>
            <h3>Pronunciations:</h3>
            {item.phonetics.map((phonetic: any, index: number) => (
              <div key={index}>
                <p>{phonetic.text}</p>
                {phonetic.audio && (
                  <audio controls>
                    <source src={phonetic.audio} type='audio/mpeg' />
                  </audio>
                )}
              </div>
            ))}
            <h3>Meanings:</h3>
            {item.meanings.map((meaning: any, index: number) => (
              <div key={index}>
                <p className='partOfSpeech'>{meaning.partOfSpeech}</p>
                <ol>
                  {meaning.definitions.map((definition: any, index: number) => (
                    <li key={index} className='definitionDetails'>
                      <p>{definition.definition}</p>
                      {definition.example && (
                        <p>Example: {definition.example}</p>
                      )}
                      {definition.synonyms &&
                        definition.synonyms.length > 0 && (
                          <p>Synonyms: {definition.synonyms.join(', ')}</p>
                        )}
                      {definition.antonyms &&
                        definition.antonyms.length > 0 && (
                          <p>Antonyms: {definition.antonyms.join(', ')}</p>
                        )}
                    </li>
                  ))}
                </ol>
              </div>
            ))}

            <h3>Source URLs:</h3>
            <ul>
              {item.sourceUrls.map((sourceUrl: string, index: number) => (
                <li key={index}>
                  <a href={sourceUrl} target='_blank' rel='noreferrer'>
                    {sourceUrl}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>
      ))}
    </div>
  )
}

function App() {
  const [word, setWord] = useState('')
  const [data, setData] = useState<DefinitionType>(null)
  const [isLoading, setLoading] = useState(false)
  const [notFound, setNotFound] = useState(false)

  async function handleSearchDefinition() {
    setLoading(true)
    setNotFound(false)
    const response = await fetch(
      'https://api.dictionaryapi.dev/api/v2/entries/en/' + word
    )
    const jsonData = await response.json()
    if (Array.isArray(jsonData)) {
      setData(jsonData)
      setNotFound(false)
    } else {
      setData(null)
      setNotFound(true)
    }
    setLoading(false)
    clearWord()
  }

  function clearWord() {
    setWord('')
  }

  return (
    <div className='App'>
      <div className='title'>Dictionary App</div>
      <div className='searchBar'>
        <input
          type='text'
          name='word'
          id='word'
          placeholder='Insert a word to search'
          onChange={(e) => {
            setWord(e.target.value)
          }}
        />
        <button type='submit' onClick={handleSearchDefinition}>
          Search
        </button>
        {isLoading ? <span>Loading...</span> : null}
      </div>
      {notFound ? <div className='notFound'>Not Found</div> : null}
      <Definition data={data} />
    </div>
  )
}

export default App

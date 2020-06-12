import React,{useState, useEffect} from 'react';
import qs from 'qs';
import {Wrapper,Card,Template,Form,Button} from './styles'
function Home() {

  const [template, setTemplate] = useState([]);
  const [selectedTemplate, setSelectedTemplate] = useState(null)
  const [boxes, setBoxes] = useState([])
  const [meme, setMeme] = useState(null)

  
  useEffect(() =>{
        (
           async () =>{
             const res = await fetch('https://api.imgflip.com/get_memes');
             const {data: {memes}} = await res.json();
             setTemplate(memes)
           }
        )();
  },[])
  function handleSelectedTemplate(template){
    setSelectedTemplate(template)
    setBoxes([])
  }
  async function handleSubmit(e){
    e.preventDefault();

    const params = qs.stringify({
      template_id: selectedTemplate.id,
      username:'MatheusLucas',
      password:'MatheusLucas',
      boxes:boxes.map(text => ({text}))
   })
   const resp = await fetch(`https://api.imgflip.com//caption_image?${params}`);
   const {data:{url}} = await resp.json();
    setMeme(url)
  }
  //currying ->função que retorna outra função
  const handleInputChange = (index) => (e) =>{
     const newValues = boxes;
     newValues[index] = e.target.value;
     setBoxes(newValues)
  }
  
  function handleReset(){
    setSelectedTemplate(null)
    setBoxes(null)
    setMeme(null)
  }
  
  
  return (
    <Wrapper>
      <h1>MEMEMAKER</h1>
      <Card>
        {
          meme && (
            <>
            <img src={meme} alt="generated Meme"/>
            <Button type="button" onClick={handleReset}>Criar outro meme</Button>
            </>
          )
        }

        {!meme && (
          <>
          <h2>selecione um template</h2>
          <Template>
            {
              template.map(template =>(
                <button 
                onClick={() => handleSelectedTemplate(template)}
                key={String(template.id)}
                className={template.id === selectedTemplate?.id ? 'selected' : ''}
                type="button">
                <img src={template.url} alt={template.name}/>
            </button>
              ))
            }
           
         
          </Template>
          {
            selectedTemplate &&(
              <>
              <h2>Textos</h2>
              <Form onSubmit={handleSubmit}>
               {(new Array(selectedTemplate.box_count).fill('').map((_, index)=>(
                  <input 
                  key={String(Math.random())}
                  placeholder={`Text #${index + 1}`}
                  onChange={handleInputChange(index)}/>
               )))}
                <Button>MakedMeme</Button>
              </Form>
              </>
            )
          }
          </>
        ) }
      </Card>
      </Wrapper>
  );
}

export default Home;
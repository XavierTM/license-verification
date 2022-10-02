

function Blockquote(props) {

   const { style={} } = props;

   return <p
      style={{
         padding: 15,
         borderLeft: '5px solid #ccc',
         color: 'grey',
         ...style
      }}
   >
      {props.children}
   </p>
}

export default Blockquote;
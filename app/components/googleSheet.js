const SHEET_ID = "17bSOKh06XUIMvwHFWqE5lcNPZyB4Yn2dqlB83ESBhHU";
const GoogleSheetComponent = () => {
    return (
      <iframe
        src={`https://docs.google.com/spreadsheets/d/${SHEET_ID}/pubhtml?widget=true&amp;headers=false`}
        width="80%"
        height="800"
        frameborder="10"
       
      ></iframe>
    );
  };
  
  export default GoogleSheetComponent;


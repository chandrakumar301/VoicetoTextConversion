import './App.css';
import LoginBar from './LoginBar';
import TextBar from './TextBar';
import SearchBar from './SearchBar';
import MicroPhone from './MicroPhone';

function App() {
  return (
    <div className="Main">
      
      <div className="Mac">
        <button className="btn1" />
        <button className="btn2" />
        <button className="btn3" />
      </div>

      <LoginBar />
      <TextBar />

      <div className="TwoinOne">
        <SearchBar />
        <MicroPhone />
      </div>

    </div>
  );
}

export default App;

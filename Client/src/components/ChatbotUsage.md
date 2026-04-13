# Chatbot Component Usage

## How to Use

1. **Import the component:**
```jsx
import Chatbot from './components/Chatbot';
```

2. **Add to your main layout:**
```jsx
function App() {
  return (
    <div>
      {/* Your existing components */}
      <Chatbot />
    </div>
  );
}
```

3. **Import CSS (optional):**
```jsx
import './components/Chatbot.css';
```

## Features

✅ **Auto-popup after 4 seconds**
✅ **Rule-based state machine logic**
✅ **No AI APIs required**
✅ **Mobile responsive design**
✅ **Local storage persistence**
✅ **Smooth animations**
✅ **Quick reply buttons**
✅ **Typing indicators**
✅ **Minimize/maximize functionality**
✅ **Reset chat option**

## Customization

### Colors
- Primary gradient: Indigo → Purple
- Bot messages: Light gray background
- User messages: Primary gradient background

### Conversation Flow
1. Greeting (auto after 4s)
2. Course selection
3. Program details
4. Lead collection
5. Student info
6. School info
7. Contact info
8. Confirmation

### State Management
- Uses React useState for step tracking
- Simple if-else logic for decision making
- localStorage for persistence

## Browser Support
- Chrome/Edge: Full support
- Firefox: Full support  
- Safari: Full support
- Mobile: Full support

## Performance
- Lightweight: ~2KB minified
- No external dependencies except Lucide icons
- Efficient re-rendering with proper dependencies

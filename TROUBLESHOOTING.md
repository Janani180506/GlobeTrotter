# Troubleshooting Registration Failed

## Common Issues and Solutions

### 1. Backend Server Not Running

**Symptom**: "Registration failed" or "Cannot connect to server"

**Solution**: Start the backend server

```bash
# In the project root directory
npm run dev
```

Or start both frontend and backend:
```bash
npm run dev:all
```

**Verify**: Check if server is running
- Open browser console (F12)
- Look for network errors
- Backend should be accessible at http://localhost:5000

### 2. Port 5000 Already in Use

**Symptom**: Backend won't start, port conflict

**Solution**: Change the port in `.env` file

```env
PORT=5001
```

Then update `client/package.json`:
```json
"proxy": "http://localhost:5001"
```

### 3. MongoDB Not Connected

**Symptom**: Server starts but registration fails with database error

**Solution**: 
```bash
# Check MongoDB status
./start-mongodb.sh

# Or start MongoDB manually
brew services start mongodb-community
```

### 4. CORS Issues

**Symptom**: Network error in browser console

**Solution**: Make sure CORS is enabled in `server.js` (already configured)

### 5. Check Browser Console

Open browser developer tools (F12) and check:
- **Console tab**: For JavaScript errors
- **Network tab**: For API request failures
  - Look for `/api/auth/register` request
  - Check status code (should be 201 for success)
  - Check response body for error details

### 6. Verify Environment Variables

Make sure `.env` file exists and has:
```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/triptales
JWT_SECRET=your_secret_key
JWT_EXPIRE=7d
NODE_ENV=development
```

### 7. Test Backend Directly

Test if backend is responding:

```bash
curl http://localhost:5000/api/cities
```

Should return JSON response.

### 8. Check Server Logs

Look at the terminal where you ran `npm run dev` for error messages.

Common errors:
- "MongoDB connection error" → Start MongoDB
- "Port already in use" → Change port
- "Cannot find module" → Run `npm install`

## Quick Diagnostic Steps

1. **Is backend running?**
   ```bash
   lsof -i :5000
   ```

2. **Is MongoDB running?**
   ```bash
   ./start-mongodb.sh
   ```

3. **Are dependencies installed?**
   ```bash
   npm install
   cd client && npm install
   ```

4. **Check browser console** for specific error messages

## Still Having Issues?

1. Check the terminal where backend is running for error messages
2. Check browser console (F12) for detailed error
3. Verify all services are running:
   - MongoDB: `./start-mongodb.sh`
   - Backend: `npm run dev`
   - Frontend: `cd client && npm start`


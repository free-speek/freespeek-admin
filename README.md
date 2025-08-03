# Freespeek Admin Panel

A modern React TypeScript admin dashboard for managing the Freespeek platform.

## 🚀 Features

### Dashboard

- **Real-time Statistics**: Live user counts, post statistics, and platform metrics
- **Live Users Tracking**: Real-time online user monitoring
- **Interactive Cards**: Clickable dashboard cards with navigation
- **Auto-refresh**: Live data updates every 5 seconds

### User Management

- **User List**: Comprehensive user listing with pagination
- **Search & Filter**: Advanced search and status filtering
- **User Details**: Detailed user profiles and information
- **Status Management**: Active, suspended, and deleted user tracking

### Chat Management

- **Support Chats**: Admin interface for support conversations
- **Regular Chats**: User-to-user chat management
- **Chat Details**: Individual chat conversation views
- **Message History**: Complete chat message history

### Authentication

- **Secure Login**: JWT-based authentication system
- **Password Visibility**: Toggle password visibility
- **Session Management**: Automatic logout and session handling

### UI/UX

- **Modern Design**: Clean, professional admin interface
- **Responsive Layout**: Works on desktop and tablet
- **Loading States**: Professional loading animations
- **Error Handling**: Graceful error display and recovery

## 🛠️ Technology Stack

- **Frontend**: React 18 with TypeScript
- **State Management**: Redux Toolkit with RTK Query
- **Styling**: Tailwind CSS
- **Icons**: Lucide React
- **Routing**: React Router DOM
- **Build Tool**: Vite
- **Package Manager**: npm

## 📦 Installation

1. **Clone the repository**

   ```bash
   git clone https://github.com/yourusername/freespeek-admin.git
   cd freespeek-admin
   ```

2. **Install dependencies**

   ```bash
   npm install
   ```

3. **Set up environment variables**

   ```bash
   cp .env.example .env
   ```

   Update `.env` with your configuration:

   ```
   REACT_APP_API_URL=http://localhost:5001
   REACT_APP_ADMIN_SECRET=your_admin_secret
   ```

4. **Start the development server**

   ```bash
   npm start
   ```

5. **Open your browser**
   Navigate to `http://localhost:3000`

## 🌍 Environment Configuration

The application supports multiple environments:

### Development (Default)

- **API URL**: `http://localhost:5001/api`
- **Environment**: `development`
- **Usage**: Local development and testing

### Production

- **API URL**: `https://api.freespeek.net/api`
- **Environment**: `production`
- **Usage**: Live production deployment

### Environment Detection

The app automatically detects the environment:

- **Development**: Uses localhost API
- **Production**: Uses production API
- **Environment Switcher**: Shows current environment in development mode

### Environment Variables

```bash
# Development
REACT_APP_API_URL=http://localhost:5001/api
REACT_APP_ADMIN_SECRET=freepeek08072024

# Production (automatically set)
NODE_ENV=production
```

## 🔧 Available Scripts

- `npm start` - Start development server
- `npm run build` - Build for production
- `npm run test` - Run tests
- `npm run eject` - Eject from Create React App

## 📁 Project Structure

```
src/
├── components/          # Reusable components
│   ├── Loader.tsx     # Loading spinner component
│   └── EnvironmentSwitcher.tsx # Environment indicator
├── config/             # Configuration files
│   └── environment.ts  # Environment configuration
├── contexts/           # React contexts
│   └── AuthContext.tsx # Authentication context
├── layouts/            # Layout components
│   └── AdminLayout.tsx # Main admin layout
├── pages/              # Page components
│   ├── DashboardPage.tsx
│   ├── FreespeekUsersPage.tsx
│   ├── ChatsPage.tsx
│   ├── SupportChatsPage.tsx
│   ├── LoginPage.tsx
│   ├── MessagesPage.tsx
│   └── ChatHistoryPage.tsx
├── services/           # API services
│   └── api.ts         # API client
├── store/              # Redux store
│   ├── index.ts       # Store configuration
│   ├── hooks.ts       # Typed Redux hooks
│   └── slices/        # Redux slices
│       ├── authSlice.ts
│       ├── dashboardSlice.ts
│       ├── usersSlice.ts
│       ├── chatsSlice.ts
│       ├── messagesSlice.ts
│       ├── chatHistorySlice.ts
│       └── supportChatsSlice.ts
├── types/              # TypeScript type definitions
│   └── index.ts
└── utils/              # Utility functions
```

## 🔌 API Integration

The admin panel integrates with the Freespeek backend API:

### Authentication Endpoints

- `POST /api/auth/login` - Admin login
- `POST /api/auth/logout` - Admin logout

### Dashboard Endpoints

- `GET /api/admin/all-counts` - Dashboard statistics
- `GET /api/admin/online-users-count` - Live user count

### User Management Endpoints

- `GET /api/admin/users` - Get paginated users
- `GET /api/admin/users/:id` - Get specific user

### Chat Endpoints

- `GET /api/admin/chats` - Get paginated chats
- `GET /api/admin/chats/:chatId/messages` - Get chat history
- `GET /api/admin/messages` - Get all messages
- `GET /api/admin/messages-count` - Get message count

## 🎨 UI Components

### Dashboard Cards

- **StatCard**: Displays metrics with icons and click handlers
- **Loading States**: Professional loading animations
- **Error Handling**: Graceful error display

### Navigation

- **Sidebar**: Responsive navigation with active states
- **Breadcrumbs**: Dynamic breadcrumb navigation
- **Search**: Global search functionality

### Tables

- **Pagination**: Advanced pagination with page numbers
- **Search**: Real-time search filtering
- **Sorting**: Column sorting capabilities
- **Actions**: Inline action buttons

## 🔐 Security Features

- **JWT Authentication**: Secure token-based authentication
- **Admin Authorization**: Role-based access control
- **API Security**: Bearer token authentication
- **Environment Variables**: Secure configuration management

## 📱 Responsive Design

- **Desktop**: Full-featured admin interface
- **Tablet**: Optimized for tablet screens
- **Mobile**: Responsive mobile layout

## 🚀 Deployment

### Production Build

```bash
npm run build
```

### Environment Variables

Set the following environment variables for production:

- `NODE_ENV`: Set to `production` for production deployment
- `REACT_APP_API_URL`: Your production API URL (auto-detected)
- `REACT_APP_ADMIN_SECRET`: Your admin secret key

### Build Commands

```bash
# Development
npm start

# Production build
npm run build

# Serve production build
npx serve -s build
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 📞 Support

For support and questions:

- Create an issue in this repository
- Contact the development team
- Check the documentation

## 🔄 Version History

- **v1.0.0** - Initial release with core admin features
- **v1.1.0** - Added pagination and search functionality
- **v1.2.0** - Enhanced UI with loading states and error handling
- **v1.3.0** - Added environment configuration and production support

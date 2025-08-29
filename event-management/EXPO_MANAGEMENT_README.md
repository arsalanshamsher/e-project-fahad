# Expo Management System

## Overview
The Expo Management System allows administrators to create, edit, and manage expos (exhibitions/conferences) through a comprehensive web interface. Instead of manually adding data to the database, admins can now use the user-friendly interface to manage all expo-related information.

## Features

### 🎯 **Comprehensive Expo Management**
- **Create New Expos**: Add complete expo information including title, description, theme, dates, location, capacity, and pricing
- **Edit Existing Expos**: Modify any expo details through the same interface
- **Delete Expos**: Remove expos with confirmation dialogs
- **Status Management**: Control expo status (draft, published, active, completed, cancelled)

### 📊 **Advanced Information Fields**
- **Basic Info**: Title, description, theme, start/end dates
- **Location Details**: Venue name, address, city, country, coordinates
- **Capacity Settings**: Maximum attendees, exhibitors, and booths
- **Pricing Structure**: Attendee price, exhibitor price, early bird discounts
- **Categories & Tags**: Flexible categorization system
- **Settings**: Public registration, approval requirements, booth limits

### 🔍 **Search & Filtering**
- **Search**: Find expos by title, theme, or location
- **Status Filter**: Filter by expo status
- **Category Filter**: Filter by expo categories
- **Real-time Results**: Instant search results as you type

### 📈 **Analytics Dashboard**
- **Statistics Overview**: Total expos, active expos, revenue, attendees
- **Performance Metrics**: Registration numbers, booth occupancy, revenue tracking
- **Visual Cards**: Easy-to-read statistics display

## How to Use

### 1. **Access Expo Management**
- Navigate to the Admin Dashboard
- Click on the "Expos" tab
- You'll see the comprehensive expo management interface

### 2. **Create a New Expo**
- Click the "Create New Expo" button
- Fill in all required fields (marked with *)
- Add categories and tags as needed
- Configure capacity and pricing settings
- Set expo status (draft is recommended for new expos)
- Click "Create Expo" to save

### 3. **Edit an Existing Expo**
- Find the expo in the table
- Click the actions menu (⋮) and select "Edit"
- Modify any fields as needed
- Click "Update Expo" to save changes

### 4. **Delete an Expo**
- Find the expo in the table
- Click the actions menu (⋮) and select "Delete"
- Confirm the deletion in the popup dialog

### 5. **Manage Expo Status**
- Use the status field to control expo visibility
- **Draft**: Private, only visible to admins
- **Published**: Public, visible to all users
- **Active**: Currently running
- **Completed**: Finished event
- **Cancelled**: Cancelled event

## Database Schema

The system uses a comprehensive MongoDB schema that includes:

```javascript
{
  title: String,           // Expo title
  description: String,      // Detailed description
  theme: String,           // Main theme
  startDate: Date,         // Start date
  endDate: Date,           // End date
  location: {
    venue: String,         // Venue name
    address: String,       // Full address
    city: String,          // City
    country: String,       // Country
    coordinates: {         // GPS coordinates
      lat: Number,
      lng: Number
    }
  },
  status: String,          // Current status
  capacity: {
    maxAttendees: Number,  // Maximum attendees
    maxExhibitors: Number, // Maximum exhibitors
    maxBooths: Number      // Maximum booths
  },
  pricing: {
    attendeePrice: Number,     // Attendee ticket price
    exhibitorPrice: Number,    // Exhibitor booth price
    earlyBirdDiscount: Number, // Early bird discount percentage
    earlyBirdEndDate: Date     // Early bird deadline
  },
  categories: [String],    // Array of categories
  tags: [String],          // Array of tags
  settings: {
    allowPublicRegistration: Boolean,    // Public registration allowed
    requireApproval: Boolean,            // Approval required
    maxBoothsPerExhibitor: Number,      // Booths per exhibitor limit
    allowBoothSharing: Boolean          // Booth sharing allowed
  },
  statistics: {
    registeredAttendees: Number,    // Current registrations
    registeredExhibitors: Number,   // Current exhibitors
    boothOccupancy: Number,         // Booth occupancy percentage
    totalRevenue: Number            // Total revenue generated
  }
}
```

## Sample Data

To populate the database with sample expo data, run:

```bash
cd event-management-backend
npm run seed:expos
```

This will create sample expos including:
- Tech Innovation Summit 2024
- Healthcare Excellence Conference
- Green Energy Expo
- Education Technology Fair

## Technical Implementation

### Frontend Components
- **ExpoManagement**: Main management interface
- **ExpoForm**: Comprehensive form for creating/editing expos
- **AdminDashboard**: Integration with admin dashboard

### Backend API
- **GET /api/expos**: Retrieve all expos
- **POST /api/expos**: Create new expo
- **PUT /api/expos/:id**: Update existing expo
- **DELETE /api/expos/:id**: Delete expo
- **GET /api/expos/:id**: Get specific expo details

### Data Validation
- Comprehensive form validation using Zod schema
- Required field validation
- Date range validation
- Numeric value validation

## Benefits

1. **No Manual Database Work**: Admins can manage expos through the web interface
2. **Comprehensive Data**: All expo information in one place
3. **User-Friendly**: Intuitive interface for non-technical users
4. **Real-time Updates**: Changes reflect immediately in the system
5. **Data Integrity**: Validation ensures data quality
6. **Scalable**: Easy to add new fields and features

## Future Enhancements

- **Image Upload**: Add expo images and floor plans
- **Bulk Operations**: Import/export multiple expos
- **Advanced Analytics**: Detailed reporting and insights
- **Integration**: Connect with external event platforms
- **Notifications**: Automated alerts for expo updates

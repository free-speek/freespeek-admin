# Anime.js Animations

This project uses Anime.js animations to enhance the user experience. The animations are implemented using the `animejs` library with CommonJS imports for compatibility.

## Components

### AnimeAnimation

A reusable component for displaying Anime.js animations.

**Props:**

- `children`: React children to animate
- `animationType`: Type of animation ("fadeIn" | "slideIn" | "bounce" | "pulse" | "rotate" | "scale")
- `duration`: Animation duration in milliseconds (default: 1000)
- `delay`: Animation delay in milliseconds (default: 0)
- `easing`: Animation easing function (default: "easeOutElastic")
- `className`: Custom CSS classes
- `style`: Custom CSS styles

**Usage:**

```tsx
import AnimeAnimation from "../components/AnimeAnimation";

<AnimeAnimation animationType="fadeIn" duration={800} delay={100}>
  <div>Content to animate</div>
</AnimeAnimation>;
```

### AnimatedStatCard

A specialized component for animated stat cards with hover effects.

**Props:**

- `title`: Card title
- `value`: Card value
- `icon`: Lucide React icon component
- `iconColor`: Icon background color class
- `subtitle`: Optional subtitle
- `onClick`: Optional click handler
- `animationType`: Animation type for card entrance
- `delay`: Animation delay

**Usage:**

```tsx
import AnimatedStatCard from "../components/AnimatedStatCard";
import { Users } from "lucide-react";

<AnimatedStatCard
  title="Total Users"
  value={1234}
  icon={Users}
  iconColor="bg-blue-500"
  animationType="fadeIn"
  delay={100}
/>;
```

### AnimeLoader

An animated loading component with rotating circles.

**Props:**

- `size`: Size variant ("sm" | "md" | "lg")
- `color`: Custom color (hex string)

**Usage:**

```tsx
import AnimeLoader from "../components/AnimeLoader";

<AnimeLoader size="lg" color="#3B82F6" />;
```

### AnimeNotification

An animated notification component with different types.

**Props:**

- `message`: Notification message
- `type`: Notification type ("success" | "error" | "warning" | "info")
- `isVisible`: Visibility state
- `onClose`: Optional close handler

**Usage:**

```tsx
import AnimeNotification from "../components/AnimeNotification";

<AnimeNotification
  message="Operation completed successfully!"
  type="success"
  isVisible={showNotification}
  onClose={() => setShowNotification(false)}
/>;
```

## Available Animation Types

- `fadeIn`: Fade in with slight upward movement
- `slideIn`: Slide in from left with fade
- `bounce`: Bounce animation with scale
- `pulse`: Pulse animation with scale and opacity
- `rotate`: Rotation animation with scale
- `scale`: Scale animation with fade

## Integration with Dashboard

The dashboard uses Anime.js animations in several ways:

1. **Loading States**: Replaced standard loader with animated loading
2. **Stat Cards**: All stat cards now have entrance animations and hover effects
3. **Success Notifications**: Shows animated success feedback
4. **Contextual Animations**: Different animations for different data types:
   - **Live Users**: Pulse animation for real-time data
   - **Active Users**: Bounce animation for positive metrics
   - **Ratings**: Rotate animation for star ratings
   - **Alerts**: Pulse animation for urgent data
   - **General Stats**: FadeIn/SlideIn for standard metrics

## Animation Features

- **Staggered Animations**: Cards animate in sequence with delays
- **Hover Effects**: Icons animate on hover with scale and rotation
- **Smooth Easing**: Uses elastic and back easing for natural feel
- **Performance Optimized**: Lightweight animations that don't impact performance
- **Responsive Design**: Animations scale properly on all screen sizes

## Performance Considerations

- Animations are lightweight and optimized
- Uses CSS transforms for better performance
- Animations automatically clean up when components unmount
- Consider disabling animations on low-end devices
- Animations pause when not visible

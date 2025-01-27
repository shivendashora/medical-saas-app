# Measure-X

Measure-X is a SaaS application designed to provide a seamless and efficient way to annotate images. Whether you are a professional in need of precise measurements or just someone who wants to add annotations to images, Measure-X has got you covered.

## Features

- Upload and manage multiple images.
- Annotate images with various shapes like rectangles, circles, lines, and angles.
- Crop images to focus on specific areas.
- Adjust image brightness for better visibility.
- Save annotated images for future reference.
- Dark mode support for better visibility in low-light environments.

## Libraries Used

- **React**: A JavaScript library for building user interfaces.
- **React Router**: A library for routing in React applications.
- **React Konva**: A library for drawing complex canvas graphics using React.
- **GSAP**: A JavaScript library for creating high-performance animations.
- **React Icons**: A library for including popular icons in React projects.

## Setup and Installation

1. **Clone the repository**:
    ```bash
    git clone https://github.com/shivendashora/measure-x.git
    cd measure-x
    ```

2. **Install dependencies**:
    ```bash
    npm install
    ```

3. **Start the development server**:
    ```bash
    npm start
    ```

4. **Open your browser** and navigate to `http://localhost:3000` to see the application running.

## Folder Structure

- **/src**: Contains the source code of the application.
  - **/Components**: Contains reusable React components.
  - **/Pages**: Contains the main pages of the application (Home, Crop, About).
  - **App.jsx**: The main application component.
  - **index.js**: The entry point of the application.

## Components and Functionalities

### Navbar
The Navbar component provides navigation links to different pages of the application. It includes links to the Home and Annotate pages. The text color changes based on the dark mode setting.

### Home Page
The Home page introduces the application and provides a button to get started with the annotation process. It includes animations for text and images using GSAP.

### Crop Page
The Crop page allows users to upload multiple images and select an image for annotation. It includes functionalities to remove images, navigate between images, and start the annotation process.

### ImageAnnotator
The ImageAnnotator component provides tools for annotating images. It includes the following functionalities:
- **Circle Tool**: Draw circles on the image.
- **Rectangle Tool**: Draw rectangles on the image.
- **Line Tool**: Draw lines on the image.
- **Angle Tool**: Measure angles between three points on the image.
- **Crop Tool**: Crop a specific area of the image.
- **Save Button**: Save the annotated image.
- **Back Button**: Return to the previous screen.
- **Zoom In/Out Buttons**: Zoom in and out of the image.
- **Clear Button**: Clear all annotations.
- **Brightness Slider**: Adjust the brightness of the image.

### Buttons and Icons
- **Upload Images Button**: Opens a file dialog to upload images. Multiple images can be uploaded.
- **Continue Button**: Proceeds to the annotation screen with the selected image.
- **Annotate Button**: Starts the annotation process for the selected image.
- **Slider Buttons**: Used for sliding across multiple images and performing annotations.
- **Circle Icon (FaCircle)**: Selects the circle tool for drawing circles.
- **Rectangle Icon (FaSquare)**: Selects the rectangle tool for drawing rectangles.
- **Line Icon (FaRulerCombined)**: Selects the line tool for drawing lines.
- **Angle Icon (FaAngleDoubleRight)**: Selects the angle tool for measuring angles.
- **Crop Icon (FaCrop)**: Selects the crop tool for cropping the image.
- **Save Icon (FaSave)**: Saves the annotated image.
- **Back Icon (FaArrowLeft)**: Returns to the previous screen.
- **Zoom In Icon (FaSearchPlus)**: Zooms in on the image.
- **Zoom Out Icon (FaSearchMinus)**: Zooms out of the image.
- **Clear Icon (FaTimes)**: Clears all annotations.

## Calculations

### Line Length Calculation
The length of a line is calculated using the distance formula:
\[ \text{Length} = \sqrt{(x_2 - x_1)^2 + (y_2 - y_1)^2} \]
This formula calculates the Euclidean distance between two points \((x_1, y_1)\) and \((x_2, y_2)\).

### Angle Calculation
The angle between three points is calculated using the arctangent function:
\[ \text{Angle} = \left| \frac{\text{atan2}(y_3 - y_2, x_3 - x_2) - \text{atan2}(y_1 - y_2, x_1 - x_2)}{\pi} \times 180 \right| \]
This formula calculates the angle formed by three points \((x_1, y_1)\), \((x_2, y_2)\), and \((x_3, y_3)\).

### Rectangle Area Calculation
The area of a rectangle is calculated using the formula:
\[ \text{Area} = \text{Width} \times \text{Height} \]
Where width and height are the dimensions of the rectangle.

### Circle Area Calculation
The area of a circle is calculated using the formula:
\[ \text{Area} = \pi \times \left(\frac{\text{Diameter}}{2}\right)^2 \]
Where the diameter is the width of the circle.

## Building for Production

To build the application for production, run the following command:
```bash
npm run build
```
This will create an optimized build of the application in the `build` directory. The build is minified and the filenames include the hashes. Your app is ready to be deployed!

## Serving for Local Development

To serve the application for local development, use the following command:
```bash
npm start
```
This will start the development server and open the application in your default browser. The server will automatically reload if you make changes to the code.

## Future Development Scope

Measure-X has a wide range of potential future developments, including:
- **Advanced Image Processing**: Implementing more advanced image processing techniques such as edge detection, segmentation, and filtering.
- **Collaboration Features**: Allowing multiple users to collaborate on the same image annotations in real-time.
- **Integration with Medical Systems**: Integrating with medical imaging systems (e.g., DICOM) to support a wider range of image formats and workflows.
- **Machine Learning**: Incorporating machine learning models to assist with automatic annotation and analysis of images.
- **Mobile Support**: Developing a mobile version of the application to allow users to annotate images on the go.
- **Enhanced User Interface**: Continuously improving the user interface to make it more intuitive and user-friendly.
- **Export Options**: Adding more export options for annotated images, such as PDF and SVG formats.
- **User Authentication**: Implementing user authentication and authorization to provide a personalized experience and secure data storage.

## Contributing

We welcome contributions to Measure-X! If you have any ideas, suggestions, or bug reports, please open an issue or submit a pull request.

## License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for more details.

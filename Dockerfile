FROM nginx

LABEL andasy_launch_runtime="Vite"

# Serve the prebuilt frontend bundle.
COPY dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Start the server by default, this can be overwritten at runtime
EXPOSE 80
CMD [ "nginx", "-g", "daemon off;" ]

using System;
using System.Collections.Generic;
using System.Diagnostics;
using Tobii.StreamEngine;
using Fleck;
using System.Linq;
using System.Runtime.InteropServices;

namespace TobiiEyeCS {
    public static class Program {
        private static List<IWebSocketConnection> sockets;

        public static void Main() {
            // Add close handler
            _handler += new EventHandler(Handler);
            SetConsoleCtrlHandler(_handler, true);

            // Start WebSocket
            var server = new WebSocketServer("ws://127.0.0.1:8181");
            sockets = new List<IWebSocketConnection>();
            server.Start(socket => {
                socket.OnOpen = () => { sockets.Add(socket); Console.WriteLine("Open!"); };
                socket.OnClose = () => { sockets.Remove(socket); Console.WriteLine("Close!"); };
                socket.OnMessage = message => { sockets.ToList().ForEach(s => s.Send(message)); };
            });

            // Handle TobiiEye

            // Create API context
            tobii_error_t result = Interop.tobii_api_create(out apiContext, null);
            Debug.Assert(result == tobii_error_t.TOBII_ERROR_NO_ERROR);

            // Enumerate devices to find connected eye trackers
            List<string> urls;
            result = Interop.tobii_enumerate_local_device_urls(apiContext, out urls);
            Debug.Assert(result == tobii_error_t.TOBII_ERROR_NO_ERROR);
            if (urls.Count == 0) {
                Console.WriteLine("Error: No device found");
                return;
            }

            // Connect to the first tracker found
            result = Interop.tobii_device_create(apiContext, urls[0], out deviceContext);
            Debug.Assert(result == tobii_error_t.TOBII_ERROR_NO_ERROR);

            // Subscribe to gaze data
            result = Interop.tobii_gaze_point_subscribe(deviceContext, OnGazePoint);
            Debug.Assert(result == tobii_error_t.TOBII_ERROR_NO_ERROR);

            while (true) {
                // Process callbacks on this thread if data is available
                Interop.tobii_device_process_callbacks(deviceContext);
                Debug.Assert(result == tobii_error_t.TOBII_ERROR_NO_ERROR);
            }
        }

        // Callback for the TobiiEye subscription
        private static void OnGazePoint(ref tobii_gaze_point_t gazePoint) {
            // Check that the data is valid before using it
            if (gazePoint.validity == tobii_validity_t.TOBII_VALIDITY_VALID) {
                string message = gazePoint.position.x + ";" + gazePoint.position.y;
                sockets.ToList().ForEach(s => s.Send(message));
            }
        }

        // Create the close events
        #region Trap application termination
        [DllImport("Kernel32")]
        private static extern bool SetConsoleCtrlHandler(EventHandler handler, bool add);

        private delegate bool EventHandler(CtrlType sig);
        static EventHandler _handler;

        enum CtrlType {
            CTRL_C_EVENT = 0,
            CTRL_BREAK_EVENT = 1,
            CTRL_CLOSE_EVENT = 2,
            CTRL_LOGOFF_EVENT = 5,
            CTRL_SHUTDOWN_EVENT = 6
        }

        private static IntPtr deviceContext, apiContext;
        private static bool Handler(CtrlType sig) {
            // Cleanup
            tobii_error_t result = Interop.tobii_gaze_point_unsubscribe(deviceContext);
            Debug.Assert(result == tobii_error_t.TOBII_ERROR_NO_ERROR);
            result = Interop.tobii_device_destroy(deviceContext);
            Debug.Assert(result == tobii_error_t.TOBII_ERROR_NO_ERROR);
            result = Interop.tobii_api_destroy(apiContext);
            Debug.Assert(result == tobii_error_t.TOBII_ERROR_NO_ERROR);

            //shutdown right away so there are no lingering threads
            Environment.Exit(-1);

            return true;
        }
        #endregion
    }
}

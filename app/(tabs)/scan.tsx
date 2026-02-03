import { useState, useRef, useCallback } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Dimensions, Image, ActivityIndicator, Alert } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { Ionicons } from '@expo/vector-icons';
import { CameraView, useCameraPermissions } from 'expo-camera';
import * as ImagePicker from 'expo-image-picker';
import { File } from 'expo-file-system/next';
import { LinearGradient } from 'expo-linear-gradient';
import { useFocusEffect } from '@react-navigation/native';
import { router } from 'expo-router';
import Animated, {
    useSharedValue,
    useAnimatedStyle,
    withRepeat,
    withTiming,
    withSequence,
    cancelAnimation,
    Easing,
} from 'react-native-reanimated';
import { identifyPlant, PlantIdError } from '../../services/plantIdService';

const { width, height } = Dimensions.get('window');
const VIEWFINDER_SIZE = width * 0.75;

export default function Scan() {
    const cameraRef = useRef<CameraView>(null);
    const [flash, setFlash] = useState<'off' | 'on'>('off');
    const [permission, requestPermission] = useCameraPermissions();
    const [isScanning, setIsScanning] = useState(false);
    const [isCapturing, setIsCapturing] = useState(false);
    const [capturedImage, setCapturedImage] = useState<string | null>(null);

    // Ref for timeout cleanup
    const scanTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

    // Reanimated shared values (much simpler than Animated API)
    const pulseScale = useSharedValue(1);
    const cornerOpacity = useSharedValue(0.6);
    const scanLineProgress = useSharedValue(0);

    // Animated styles
    const pulseAnimatedStyle = useAnimatedStyle(() => ({
        transform: [{ scale: pulseScale.value }],
    }));

    const cornerAnimatedStyle = useAnimatedStyle(() => ({
        opacity: cornerOpacity.value,
    }));

    const scanLineAnimatedStyle = useAnimatedStyle(() => ({
        transform: [{ translateY: scanLineProgress.value * (VIEWFINDER_SIZE - 4) }],
    }));

    // Start looping animations
    const startAnimations = useCallback(() => {
        // Pulse animation (1 -> 1.1 -> 1, repeating)
        pulseScale.value = withRepeat(
            withSequence(
                withTiming(1.1, { duration: 1000 }),
                withTiming(1, { duration: 1000 })
            ),
            -1 // infinite
        );

        // Corner opacity animation (0.6 -> 1 -> 0.6, repeating)
        cornerOpacity.value = withRepeat(
            withSequence(
                withTiming(1, { duration: 2000 }),
                withTiming(0.6, { duration: 2000 })
            ),
            -1
        );
    }, []);

    // Reset session when screen gains focus
    useFocusEffect(
        useCallback(() => {
            // Reset all state
            setCapturedImage(null);
            setIsScanning(false);
            setIsCapturing(false);
            scanLineProgress.value = 0;

            // Start animations
            startAnimations();

            return () => {
                // Cleanup
                cancelAnimation(pulseScale);
                cancelAnimation(cornerOpacity);
                cancelAnimation(scanLineProgress);
                if (scanTimeoutRef.current) {
                    clearTimeout(scanTimeoutRef.current);
                    scanTimeoutRef.current = null;
                }
            };
        }, [startAnimations])
    );



    const toggleFlash = () => {
        setFlash(current => (current === 'off' ? 'on' : 'off'));
    };

    const pickImage = async () => {
        if (isCapturing || isScanning) return;

        const result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ['images'],
            allowsEditing: true,
            aspect: [1, 1],
            quality: 0.8,
        });

        if (!result.canceled && result.assets[0]) {
            setCapturedImage(result.assets[0].uri);
        }
    };

    const handleCapture = async () => {
        if (!cameraRef.current || isScanning || capturedImage || isCapturing) return;

        setIsCapturing(true);
        try {
            const photo = await cameraRef.current.takePictureAsync({
                quality: 0.8,
                base64: false,
            });

            if (photo) {
                setCapturedImage(photo.uri);
            } else {
                Alert.alert('Capture Failed', 'Unable to capture image. Please try again.');
            }
        } catch (error) {
            console.error('Failed to capture image:', error);
            Alert.alert('Capture Failed', 'Something went wrong while capturing the image. Please try again.');
        } finally {
            setIsCapturing(false);
        }
    };

    const startScanning = async () => {
        console.log("==> started")
        if (!capturedImage || isScanning) return;

        setIsScanning(true);

        // Start scan line animation
        scanLineProgress.value = withRepeat(
            withSequence(
                withTiming(1, { duration: 1500, easing: Easing.linear }),
                withTiming(0, { duration: 0 })
            ),
            -1
        );

        try {
            // Convert image to base64
            console.log("==> capturedImage", capturedImage)
            const file = new File(capturedImage);
            const base64 = await file.base64();
            console.log("==>base64", base64.substring(0, 10))
            // Call Plant.id API
            const plantData = await identifyPlant(base64);
            console.log("==>plantData", plantData)
            // Stop animation
            cancelAnimation(scanLineProgress);
            scanLineProgress.value = 0;
            setIsScanning(false);

            // Navigate to plant detail page
            router.push({
                pathname: '/plant-detail',
                params: {
                    scientificName: plantData.scientificName,
                    commonNames: plantData.commonNames.join(','),
                    probability: plantData.probability.toString(),
                    description: plantData.description,
                    imageUrl: plantData.imageUrl,
                    capturedImageUri: capturedImage,
                    family: plantData.taxonomy.family,
                    genus: plantData.taxonomy.genus,
                    order: plantData.taxonomy.order,
                    wikipediaUrl: plantData.wikipediaUrl,
                    watering: plantData.watering?.label || 'Unknown',
                    synonyms: plantData.synonyms.join(','),
                    edibleParts: plantData.edibleParts.join(','),
                    propagationMethods: plantData.propagationMethods.join(','),
                },
            });

            setCapturedImage(null);
        } catch (error) {
            // Stop animation
            cancelAnimation(scanLineProgress);
            scanLineProgress.value = 0;
            setIsScanning(false);

            // Show error message
            if (error instanceof PlantIdError) {
                Alert.alert('Identification Failed', error.message);
            } else {
                Alert.alert('Error', 'Something went wrong. Please try again.');
            }
        }
    };

    const handleScanComplete = () => {
        // This is now handled in startScanning
        cancelAnimation(scanLineProgress);
        scanLineProgress.value = 0;
        setIsScanning(false);
        setCapturedImage(null);
    };

    const handleRetake = () => {
        if (scanTimeoutRef.current) {
            clearTimeout(scanTimeoutRef.current);
            scanTimeoutRef.current = null;
        }

        cancelAnimation(scanLineProgress);
        scanLineProgress.value = 0;

        setCapturedImage(null);
        setIsScanning(false);
        setIsCapturing(false);
    };

    // Permission not determined yet
    if (!permission) {
        return (
            <View style={styles.container}>
                <StatusBar style="light" />
                <View style={styles.loadingContainer}>
                    <Ionicons name="camera" size={48} color="#37ec13" />
                    <Text style={styles.loadingText}>Initializing camera...</Text>
                </View>
            </View>
        );
    }

    // Permission denied
    if (!permission.granted) {
        return (
            <View style={styles.container}>
                <StatusBar style="light" />
                <View style={styles.permissionContainer}>
                    <View style={styles.permissionIcon}>
                        <Ionicons name="camera-outline" size={64} color="#37ec13" />
                    </View>
                    <Text style={styles.permissionTitle}>Camera Access Required</Text>
                    <Text style={styles.permissionText}>
                        We need camera access to identify plants. Your photos are processed locally and never stored.
                    </Text>
                    <TouchableOpacity style={styles.permissionButton} onPress={requestPermission}>
                        <Text style={styles.permissionButtonText}>Grant Camera Access</Text>
                    </TouchableOpacity>
                </View>
            </View>
        );
    }

    return (
        <View style={styles.container}>
            <StatusBar style="light" />

            {/* Camera View or Captured Image */}
            {capturedImage ? (
                <Image
                    source={{ uri: capturedImage }}
                    style={StyleSheet.absoluteFill}
                    resizeMode="cover"
                />
            ) : (
                <CameraView
                    ref={cameraRef}
                    style={StyleSheet.absoluteFill}
                    facing="back"
                    flash={flash}
                />
            )}

            {/* Top Gradient Overlay */}
            {!isScanning && (
                <View>
                    <LinearGradient
                        colors={['rgba(0,0,0,0.7)', 'transparent']}
                        style={styles.topGradient}
                    />
                </View>
            )}

            {/* Bottom Gradient Overlay */}
            {!isScanning && (
                <View>
                    <LinearGradient
                        colors={['transparent', 'rgba(0,0,0,0.8)']}
                        style={styles.bottomGradient}
                    />
                </View>
            )}

            {/* Top Header */}
            {!isScanning && (
                <View style={styles.topControls}>
                    <View style={styles.headerCenter}>
                        <Text style={styles.headerTitle}>
                            {capturedImage ? 'Review Photo' : 'Scan Plant'}
                        </Text>
                        <Text style={styles.headerSubtitle}>
                            {capturedImage ? 'Tap Scan to identify' : 'Position plant in frame'}
                        </Text>
                    </View>
                </View>
            )}

            {/* Viewfinder */}
            <View style={styles.viewfinderContainer}>
                <Animated.View style={[styles.viewfinder]}>
                    {/* Corner Brackets */}
                    <Animated.View style={[styles.corner, styles.topLeft, cornerAnimatedStyle]} />
                    <Animated.View style={[styles.corner, styles.topRight, cornerAnimatedStyle]} />
                    <Animated.View style={[styles.corner, styles.bottomLeft, cornerAnimatedStyle]} />
                    <Animated.View style={[styles.corner, styles.bottomRight, cornerAnimatedStyle]} />

                    {/* Scan Line */}
                    {isScanning && (
                        <Animated.View style={[styles.scanLine, scanLineAnimatedStyle]} />
                    )}
                </Animated.View>

                {/* Scanning Indicator */}
                {isScanning && (
                    <View style={styles.scanningIndicator}>
                        <Ionicons name="leaf" size={20} color="#37ec13" />
                        <Text style={styles.scanningText}>Analyzing plant...</Text>
                    </View>
                )}
            </View>

            {/* Bottom Controls - Camera Mode */}
            {!capturedImage && !isScanning && (
                <View style={styles.bottomControls}>
                    {/* Gallery Button */}
                    <TouchableOpacity style={styles.sideButton} onPress={pickImage}>
                        <View style={styles.sideButtonInner}>
                            <Ionicons name="images" size={28} color="#fff" />
                        </View>
                        <Text style={styles.sideButtonLabel}>Gallery</Text>
                    </TouchableOpacity>

                    {/* Capture Button */}
                    <Animated.View style={pulseAnimatedStyle}>
                        <TouchableOpacity
                            style={styles.captureButton}
                            onPress={handleCapture}
                            disabled={isCapturing}
                        >
                            <View style={styles.captureButtonInner}>
                                {isCapturing ? (
                                    <ActivityIndicator size="large" color="#37ec13" />
                                ) : (
                                    <View style={styles.captureButtonCore} />
                                )}
                            </View>
                        </TouchableOpacity>
                    </Animated.View>

                    {/* Flash Button */}
                    <TouchableOpacity style={styles.sideButton} onPress={toggleFlash}>
                        <View style={styles.sideButtonInner}>
                            <Ionicons
                                name={flash === 'on' ? 'flash' : 'flash-off'}
                                size={28}
                                color="#fff"
                            />
                        </View>
                        <Text style={styles.sideButtonLabel}>Flash</Text>
                    </TouchableOpacity>
                </View>
            )}

            {/* Preview Controls - After Capture */}
            {capturedImage && !isScanning && (
                <View style={styles.previewControls}>
                    <TouchableOpacity style={styles.previewButton} onPress={handleRetake}>
                        <Ionicons name="refresh" size={24} color="#fff" />
                        <Text style={styles.previewButtonText}>Retake</Text>
                    </TouchableOpacity>

                    <TouchableOpacity style={[styles.previewButton, styles.scanButton]} onPress={startScanning}>
                        <Ionicons name="scan" size={24} color="#fff" />
                        <Text style={styles.previewButtonText}>Scan Plant</Text>
                    </TouchableOpacity>
                </View>
            )}

            {/* Hint Text */}
            {!capturedImage && !isScanning && (
                <View style={styles.hintContainer}>
                    <Ionicons name="leaf-outline" size={16} color="rgba(255,255,255,0.7)" />
                    <Text style={styles.hintText}>Tap the button to identify your plant</Text>
                </View>
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#000',
    },
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        gap: 16,
    },
    loadingText: {
        color: '#fff',
        fontSize: 16,
    },
    permissionContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 32,
    },
    permissionIcon: {
        width: 120,
        height: 120,
        borderRadius: 60,
        backgroundColor: 'rgba(55, 236, 19, 0.15)',
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 24,
    },
    permissionTitle: {
        color: '#fff',
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 12,
        textAlign: 'center',
    },
    permissionText: {
        color: 'rgba(255,255,255,0.7)',
        fontSize: 16,
        textAlign: 'center',
        marginBottom: 32,
        lineHeight: 24,
    },
    permissionButton: {
        backgroundColor: '#37ec13',
        paddingHorizontal: 32,
        paddingVertical: 16,
        borderRadius: 30,
    },
    permissionButtonText: {
        color: '#000',
        fontSize: 16,
        fontWeight: 'bold',
    },
    topGradient: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        height: 150,
    },
    bottomGradient: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        height: 250,
    },
    topControls: {
        position: 'absolute',
        top: 60,
        left: 0,
        right: 0,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: 20,
    },
    controlButton: {
        width: 44,
        height: 44,
        borderRadius: 22,
        backgroundColor: 'rgba(255,255,255,0.2)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    headerCenter: {
        alignItems: 'center',
    },
    headerTitle: {
        color: '#fff',
        fontSize: 18,
        fontWeight: 'bold',
    },
    headerSubtitle: {
        color: 'rgba(255,255,255,0.7)',
        fontSize: 13,
        marginTop: 4,
    },
    viewfinderContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    viewfinder: {
        width: VIEWFINDER_SIZE,
        height: VIEWFINDER_SIZE,
        position: 'relative',
    },
    corner: {
        position: 'absolute',
        width: 40,
        height: 40,
        borderColor: '#37ec13',
    },
    topLeft: {
        top: 0,
        left: 0,
        borderTopWidth: 4,
        borderLeftWidth: 4,
        borderTopLeftRadius: 12,
    },
    topRight: {
        top: 0,
        right: 0,
        borderTopWidth: 4,
        borderRightWidth: 4,
        borderTopRightRadius: 12,
    },
    bottomLeft: {
        bottom: 0,
        left: 0,
        borderBottomWidth: 4,
        borderLeftWidth: 4,
        borderBottomLeftRadius: 12,
    },
    bottomRight: {
        bottom: 0,
        right: 0,
        borderBottomWidth: 4,
        borderRightWidth: 4,
        borderBottomRightRadius: 12,
    },
    scanLine: {
        position: 'absolute',
        left: 2,
        right: 2,
        height: 2,
        backgroundColor: '#37ec13',
        shadowColor: '#37ec13',
        shadowOffset: { width: 0, height: 0 },
        shadowOpacity: 1,
        shadowRadius: 10,
    },
    scanningIndicator: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
        marginTop: 20,
        backgroundColor: 'rgba(0,0,0,0.6)',
        paddingHorizontal: 16,
        paddingVertical: 10,
        borderRadius: 20,
    },
    scanningText: {
        color: '#fff',
        fontSize: 14,
        fontWeight: '500',
    },
    bottomControls: {
        position: 'absolute',
        bottom: 100,
        left: 0,
        right: 0,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        gap: 40,
    },
    sideButton: {
        alignItems: 'center',
        gap: 8,
    },
    sideButtonInner: {
        width: 56,
        height: 56,
        borderRadius: 28,
        backgroundColor: 'rgba(255,255,255,0.15)',
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.3)',
    },
    sideButtonLabel: {
        color: 'rgba(255,255,255,0.8)',
        fontSize: 12,
        fontWeight: '500',
    },
    captureButton: {
        width: 80,
        height: 80,
        borderRadius: 40,
        backgroundColor: 'rgba(255,255,255,0.3)',
        justifyContent: 'center',
        alignItems: 'center',
        padding: 4,
    },
    captureButtonInner: {
        width: '100%',
        height: '100%',
        borderRadius: 36,
        backgroundColor: '#fff',
        justifyContent: 'center',
        alignItems: 'center',
        padding: 4,
    },
    captureButtonCore: {
        width: '100%',
        height: '100%',
        borderRadius: 32,
        backgroundColor: '#37ec13',
    },
    hintContainer: {
        position: 'absolute',
        bottom: 50,
        left: 0,
        right: 0,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        gap: 8,
    },
    hintText: {
        color: 'rgba(255,255,255,0.7)',
        fontSize: 13,
    },
    previewControls: {
        position: 'absolute',
        bottom: 80,
        left: 20,
        right: 20,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        gap: 20,
    },
    previewButton: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        paddingHorizontal: 24,
        paddingVertical: 16,
        borderRadius: 30,
        backgroundColor: 'rgba(255,255,255,0.2)',
        gap: 8,
        minWidth: 130,
    },
    scanButton: {
        backgroundColor: '#37ec13',
    },
    previewButtonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: '600',
    },
});

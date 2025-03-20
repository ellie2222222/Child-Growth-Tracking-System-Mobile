// import React, { useState, useEffect } from "react";
// import {
//   View,
//   Text,
//   SectionList,
//   TouchableOpacity,
//   StyleSheet,
//   ActivityIndicator,
// } from "react-native";
// import { FAB, useTheme } from "react-native-paper";
// import api from "../../configs/api";
// import Title from "../Title";

// const GrowthDataList = ({ route }) => {
//   const theme = useTheme();
//   const { childId } = route.params;
//   const [growthData, setGrowthData] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);
//   const [order, setOrder] = useState("descending");
//   const [page, setPage] = useState(1); 
//   const [size, setSize] = useState(5); 
//   const [totalPages, setTotalPages] = useState(1); 

//   useEffect(() => {
//     const fetchGrowthData = async () => {
//       try {
//         setLoading(true);
//         const response = await api.get(
//           `/children/${childId}/growth-data?order=${order}&page=${page}&size=${size}`
//         );
//         setGrowthData(response.data.growthData);
//         setTotalPages(response.data.totalPages);
//       } catch (err) {
//         setError(err.message);
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchGrowthData();
//   }, [childId, order, page, size]); // Add page and size to dependency array

//   const groupedGrowthData = growthData.reduce((acc, data) => {
//     const date = new Date(data.inputDate).toLocaleDateString();
//     if (!acc[date]) {
//       acc[date] = [];
//     }
//     acc[date].push(data);
//     return acc;
//   }, {});

//   const sectionData = Object.keys(groupedGrowthData).map((date) => ({
//     title: date,
//     data: groupedGrowthData[date],
//   }));

//   const renderGrowthDataItem = ({ item }) => (
//     <View style={styles(theme).itemContainer}>
//       <Text style={styles(theme).itemText}>Weight: {item.weight} kg</Text>
//       <Text style={styles(theme).itemText}>Height: {item.height} cm</Text>
//       <Text style={styles(theme).itemText}>
//         BMI: {item.bmi ? item.bmi + " kg/m²" : "N/A"}
//       </Text>
//       <Text style={styles(theme).itemText}>
//         Head Circumference: {item.headCircumference ? item.headCircumference + " cm" : "N/A"}
//       </Text>
//       <Text style={styles(theme).itemText}>
//         Arm Circumference: {item.armCircumference ? item.armCircumference + " cm" : "N/A"}
//       </Text>
//     </View>
//   );

//   if (loading) {
//     return (
//       <View style={styles(theme).container}>
//         <ActivityIndicator size="large" color={theme.colors.primary} />
//       </View>
//     );
//   }

//   if (error) {
//     return (
//       <View style={styles(theme).container}>
//         <Text style={styles(theme).errorText}>Error: {error}</Text>
//       </View>
//     );
//   }

//   return (
//     <View style={styles(theme).container}>
//       <Title text="Child's growth data" style={{ fontSize: 24, textAlign: "left", marginBottom: 20 }} />
//       <View style={styles(theme).sortContainer}>
//         <TouchableOpacity
//           onPress={() => setOrder(order === "ascending" ? "descending" : "ascending")}
//           style={styles(theme).sortButton}
//         >
//           <Text
//             style={{
//               color: "white",
//               fontFamily: theme.fonts.medium.fontFamily,
//               fontSize: 16,
//             }}
//           >
//             Sort by Date ({order})
//           </Text>
//         </TouchableOpacity>
//       </View>

//       <SectionList
//         sections={sectionData}
//         keyExtractor={(item) => item._id}
//         renderItem={renderGrowthDataItem}
//         renderSectionHeader={({ section: { title } }) => (
//           <Text style={styles(theme).sectionHeader}>{title}</Text>
//         )}
//       />

//       {/* Pagination Controls */}
//       <View style={styles(theme).paginationContainer}>
//         <TouchableOpacity
//           disabled={page === 1}
//           onPress={() => setPage((prev) => Math.max(prev - 1, 1))}
//           style={[
//             styles(theme).paginationButton,
//             page === 1 && styles(theme).disabledButton,
//           ]}
//         >
//           <Text style={styles(theme).paginationText}>Previous</Text>
//         </TouchableOpacity>

//         <Text style={styles(theme).pageInfo}>
//           Page {page} of {totalPages}
//         </Text>

//         <TouchableOpacity
//           disabled={page === totalPages}
//           onPress={() => setPage((prev) => Math.min(prev + 1, totalPages))}
//           style={[
//             styles(theme).paginationButton,
//             page === totalPages && styles(theme).disabledButton,
//           ]}
//         >
//           <Text style={styles(theme).paginationText}>Next</Text>
//         </TouchableOpacity>
//       </View>
      
//       <FAB
//         style={styles.fab(theme)}
//         icon="plus"
//         color="white"
//         onPress={() => {}}
//       />
//     </View>
//   );
// };

// const styles = (theme) =>
//   StyleSheet.create({
//     container: {
//       flex: 1,
//       backgroundColor: theme.colors.background,
//       padding: 16,
//     },
//     sortContainer: {
//       marginBottom: 16,
//     },
//     sortButton: {
//       backgroundColor: theme.colors.primary,
//       borderRadius: 4,
//       padding: 8,
//       width: "auto",
//     },
//     itemContainer: {
//       width: "100%",
//       padding: 8,
//       marginVertical: 8,
//       backgroundColor: theme.colors.surface,
//       borderRadius: 4,
//       borderTopWidth: 0,
//       borderTopRightRadius: 0,
//       borderTopLeftRadius: 0,
//       borderWidth: 1,
//       borderColor: theme.colors.primary,
//     },
//     itemText: {
//       fontSize: 16,
//       color: theme.colors.text,
//       fontFamily: theme.fonts.medium.fontFamily,
//     },
//     sectionHeader: {
//       fontSize: 18,
//       fontWeight: "bold",
//       backgroundColor: theme.colors.primary,
//       color: "white",
//       padding: 8,
//       borderRadius: 4,
//       marginTop: 16,
//     },
//     errorText: {
//       fontSize: 16,
//       color: theme.colors.error,
//     },
//     paginationContainer: {
//       flexDirection: "row",
//       justifyContent: "space-between",
//       alignItems: "center",
//       marginVertical: 16,
//     },
//     paginationButton: {
//       backgroundColor: theme.colors.primary,
//       padding: 8,
//       borderRadius: 4,
//     },
//     disabledButton: {
//       backgroundColor: theme.colors.disabled,
//     },
//     paginationText: {
//       color: "white",
//       fontSize: 16,
//       fontFamily: theme.fonts.medium.fontFamily,
//     },
//     pageInfo: {
//       fontSize: 16,
//       color: theme.colors.text,
//     },
//   });

// export default GrowthDataList;
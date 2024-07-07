/* eslint-disable react/prop-types */
import {
  Page,
  Text,
  Document,
  StyleSheet,
  View,
  Image,
} from "@react-pdf/renderer";
import pacman from "../assets/pacman.png";

const styles = StyleSheet.create({
  pageNumber: {
    position: "absolute",
    fontSize: 12,
    bottom: 30,
    left: 0,
    right: 0,
    textAlign: "center",
    color: "grey",
  },
});

const InvoiceFile = ({ selectedOrder, currentUser, date }) => {
  return (
    <Document>
      <Page size="A4">
        <View
          style={{
            height: "100%",
            paddingTop: "20px",
            marginHorizontal: "15px",
          }}
        >
          <View
            style={{
              display: "flex",
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "space-between",
              fontSize: "13px",
            }}
          >
            <View
              style={{
                display: "flex",
                flexDirection: "row",
                alignItems: "center",
                gap: 2,
              }}
            >
              <Image src={pacman} style={{ width: "13px" }} />
              <Text>DumuGames</Text>
            </View>

            <View
              style={{
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
                gap: 3,
                fontSize: "10px",
              }}
            >
              <Text>INVOICE: #{selectedOrder._id}</Text>
              <Text>Date: {date}</Text>
              <View
                style={{
                  display: "flex",
                  flexDirection: "row",
                  alignItems: "center",
                  gap: 2,
                }}
              >
                <Text>Status:</Text>
                <Text style={{ color: "green", fontStyle: "bold" }}>Paid</Text>
              </View>
            </View>
          </View>

          <View
            style={{
              marginTop: "100px",
              fontSize: "11px",
            }}
          >
            <View style={{}}>
              <View
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: 2,
                  marginBottom: "20px",
                }}
              >
                <Text>BILLED TO</Text>
                {currentUser ? (
                  <>
                    <Text>{`First name: ${currentUser.first_name}`}</Text>
                    <Text>{`Last name: ${currentUser.last_name}`}</Text>
                    <Text>{`Email: ${currentUser.email}`}</Text>
                    <Text>{`Phone: ${currentUser.phone}`}</Text>
                    <Text>{`Country: ${currentUser.country}`}</Text>
                  </>
                ) : (
                  <>
                    <Text>{`Name: ${selectedOrder.userName}`}</Text>
                    <Text>{`Email: ${selectedOrder.userEmail}`}</Text>
                  </>
                )}
              </View>

              <View
                style={{
                  width: "100%",
                  backgroundColor: "black",
                  borderColor: "black",
                  padding: "1px",
                  marginVertical: "10px",
                }}
              ></View>

              <View
                style={{
                  display: "flex",
                  flexDirection: "row",
                  alignItems: "center",
                  justifyContent: "space-between",
                }}
              >
                <Text>Item</Text>
                <Text>Amount</Text>
                <Text>Price</Text>
                <Text>Quantity</Text>
                <Text>Region</Text>
                <Text>Total</Text>
              </View>

              <View
                style={{
                  width: "100%",
                  backgroundColor: "black",
                  borderColor: "black",
                  padding: "1px",
                  marginVertical: "10px",
                }}
              ></View>

              {selectedOrder.cards.map((item, idx) => (
                <View
                  key={idx}
                  style={{
                    display: "flex",
                    flexDirection: "row",
                    alignItems: "center",
                    justifyContent: "space-between",
                    marginVertical: "10px",
                  }}
                >
                  <Text>{item.cardType}</Text>
                  <Text>{item.amount}$</Text>
                  <Text>{item.cardPrice}$</Text>
                  <Text>{item.quantity}</Text>
                  <Text>{item.region}</Text>
                  <Text>{item.totalCardPrice}$</Text>
                </View>
              ))}

              <View
                style={{
                  width: "100%",
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "flex-end",
                  alignItems: "flex-end",
                }}
              >
                <Text
                  style={{ marginTop: "20px" }}
                >{`Total: ${selectedOrder.totalPrice}$`}</Text>
                <Text
                  style={{ marginTop: "10px" }}
                >{`Payments: (${selectedOrder.totalPrice}$)`}</Text>
                <View
                  style={{
                    width: "50%",
                    backgroundColor: "black",
                    borderColor: "black",
                    padding: "1px",
                    marginVertical: "10px",
                  }}
                ></View>

                <Text
                  style={{
                    color: "#5956E9",
                    textAlign: "right",
                    marginTop: "10px",
                  }}
                >
                  DumuGames Team.
                </Text>
              </View>
            </View>
          </View>
        </View>

        <Text
          style={styles.pageNumber}
          render={({ pageNumber, totalPages }) => `${pageNumber}/${totalPages}`}
        />
      </Page>
    </Document>
  );
};

export default InvoiceFile;

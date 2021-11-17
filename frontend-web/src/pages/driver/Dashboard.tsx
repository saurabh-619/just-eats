import { useMutation, useSubscription } from "@apollo/client";
import GoogleMapReact from "google-map-react";
import { useEffect, useState } from "react";
import { useHistory } from "react-router";
import Driver from "../../components/Driver";
import { COOKED_ORDERS_SUB, TAKE_ORDER_MUTATION } from "../../utils/queries";
import {
  TakeOrderMutation,
  TakeOrderMutationVariables,
} from "../../__generated__/TakeOrderMutation";
import { CookedOrdersSub } from "./../../__generated__/CookedOrdersSub";

interface ICoords {
  lat: number;
  lng: number;
}

const Dashboard = () => {
  const history = useHistory();

  const [driverCoords, setDriverCoords] = useState<ICoords>({
    lat: 28.7041,
    lng: 77.1025,
  });
  const [map, setMap] = useState<google.maps.Map>();
  const [maps, setMaps] = useState<any>();

  // @ts-ignore
  const onSuccess = ({ coords: { latitude, longitude } }: Position) => {
    setDriverCoords({ lat: latitude, lng: longitude });
  };

  // @ts-ignore
  const onError = (error: PositionError) => {
    console.log({ error });
  };

  const onApiLoaded = ({ map, maps }: { map: any; maps: any }) => {
    // @ts-ignore
    map.panTo(new google.maps.LatLng(driverCoords.lat, driverCoords.lng));
    setMap(map);
    setMaps(maps);
  };

  useEffect(() => {
    navigator.geolocation.watchPosition(onSuccess, onError);
  }, []);

  useEffect(() => {
    if (map && maps) {
      map.panTo(new google.maps.LatLng(driverCoords.lat, driverCoords.lng));

      // // Add geo coding to get name of the city
      // const geocoder = new google.maps.Geocoder();
      // geocoder.geocode(
      //   {
      //     location: new google.maps.LatLng({ ...driverCoords }),
      //   },
      //   (results, status) => {
      //     console.log({ status, results });
      //   }
      // );
    }
  }, [driverCoords.lat, driverCoords.lng]);

  const makeRoute = () => {
    if (map) {
      const directionsService = new google.maps.DirectionsService();
      const directionsRenderer = new google.maps.DirectionsRenderer({
        polylineOptions: {
          strokeColor: "#000",
          strokeOpacity: 1,
          strokeWeight: 5,
        },
      });
      directionsRenderer.setMap(map);
      directionsService.route(
        {
          origin: {
            location: new google.maps.LatLng(
              driverCoords.lat,
              driverCoords.lng
            ),
          },
          destination: {
            location: new google.maps.LatLng(
              driverCoords.lat + 0.05,
              driverCoords.lng + 0.05
            ),
          },
          travelMode: google.maps.TravelMode.DRIVING,
        },
        (result) => {
          directionsRenderer.setDirections(result);
        }
      );
    }
  };

  const { data: cookedOrdersData } =
    useSubscription<CookedOrdersSub>(COOKED_ORDERS_SUB);

  console.log({ cookedOrdersData });

  useEffect(() => {
    if (cookedOrdersData?.cookedOrder.id) {
      makeRoute();
    }
  }, [cookedOrdersData]);

  const onCompleted = (data: TakeOrderMutation) => {
    if (data.takeOrder.ok) {
      history.push(`/orders/${cookedOrdersData?.cookedOrder.id}`);
    }
  };

  const [takeOrderMutation] = useMutation<
    TakeOrderMutation,
    TakeOrderMutationVariables
  >(TAKE_ORDER_MUTATION, {
    onCompleted,
  });

  const triggerMutation = (orderId: number) => {
    takeOrderMutation({
      variables: {
        input: {
          id: orderId,
        },
      },
    });
  };
  return (
    <div>
      <div
        className="overflow-hidden"
        style={{ width: window.innerWidth, height: "50vh" }}
      >
        <GoogleMapReact
          yesIWantToUseGoogleMapApiInternals
          onGoogleApiLoaded={onApiLoaded}
          defaultZoom={12}
          draggable={true}
          defaultCenter={{ ...driverCoords }}
          bootstrapURLKeys={{
            key: "AIzaSyCtqDc_mbnkIKFHgu7K3mvW3-8UyYUaw0g",
          }}
        >
          {/* <Driver lat={driverCoords.lat} lng={driverCoords.lng} /> */}
        </GoogleMapReact>
      </div>
      <div className="relative max-w-screen-sm px-5 py-8 mx-auto bg-white shadow-lg -top-10">
        {cookedOrdersData?.cookedOrder.restaurant ? (
          <>
            <h1 className="text-3xl font-medium text-center">
              New Cooked Order
            </h1>
            <h1 className="my-3 text-2xl font-medium text-center">
              Pick it up soon @ {cookedOrdersData?.cookedOrder.restaurant?.name}
            </h1>
            <button
              onClick={() => triggerMutation(cookedOrdersData?.cookedOrder.id)}
              className="block w-full mt-5 text-center app-submit-btn"
            >
              Accept delivery &rarr;
            </button>
          </>
        ) : (
          <h1 className="text-3xl font-medium text-center">No orders yet...</h1>
        )}
      </div>
    </div>
  );
};

export default Dashboard;

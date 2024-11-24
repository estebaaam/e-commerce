import logging
import os
from fastapi import APIRouter, Request, Depends
from dotenv import load_dotenv
from paypalserversdk.http.auth.o_auth_2 import ClientCredentialsAuthCredentials
from paypalserversdk.logging.configuration.api_logging_configuration import (
    LoggingConfiguration, RequestLoggingConfiguration, ResponseLoggingConfiguration
)
from paypalserversdk.paypal_serversdk_client import PaypalServersdkClient
from paypalserversdk.controllers.orders_controller import OrdersController
from paypalserversdk.models.amount_with_breakdown import AmountWithBreakdown
from paypalserversdk.models.checkout_payment_intent import CheckoutPaymentIntent
from paypalserversdk.models.order_request import OrderRequest
from paypalserversdk.models.purchase_unit_request import PurchaseUnitRequest
from paypalserversdk.api_helper import ApiHelper
from app.core.security import verify_token

# Inicializar FastAPI
router = APIRouter()

# Cargar las variables de entorno
load_dotenv()

# Configurar cliente de PayPal
paypal_client: PaypalServersdkClient = PaypalServersdkClient(
    client_credentials_auth_credentials=ClientCredentialsAuthCredentials(
        o_auth_client_id=os.getenv('PAYPAL_CLIENT_ID'),
        o_auth_client_secret=os.getenv('PAYPAL_CLIENT_SECRET')
    ),
    logging_configuration=LoggingConfiguration(
        log_level=logging.INFO,
        mask_sensitive_headers=False,  # Cambiar a True en producción
        request_logging_config=RequestLoggingConfiguration(
            log_headers=True,
            log_body=True
        ),
        response_logging_config=ResponseLoggingConfiguration(
            log_headers=True,
            log_body=True
        )
    )
)

orders_controller: OrdersController = paypal_client.orders

# Rutas
@router.post("/api/orders")
async def create_order(request: Request, email: str = Depends(verify_token)):
    """
    Crear una orden para iniciar la transacción.
    """
    body = await request.json()  # Obtener datos enviados desde el cliente
    value = str(body.get('amount'))  # Información del carrito (puedes procesarla si es necesario)
    
    # Crear la orden con la API de PayPal
    order = orders_controller.orders_create({
        "body": OrderRequest(
            intent=CheckoutPaymentIntent.CAPTURE,
            purchase_units=[
                PurchaseUnitRequest(
                    AmountWithBreakdown(
                        currency_code='USD',
                        value=value # Cambia el valor según tu lógica del carrito
                    )
                )
            ]
        ),
        "prefer": 'return=representation'
    })
    return ApiHelper.json_serialize(order.body)

@router.post("/api/orders/{order_id}/capture")
async def capture_order(order_id: str, email: str = Depends(verify_token)):
    """
    Capturar el pago de una orden para completar la transacción.
    """
    order = orders_controller.orders_capture({
        'id': order_id,
        'prefer': 'return=representation'
    })
    return ApiHelper.json_serialize(order.body)

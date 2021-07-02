// SPDX-License-Identifier: GPL-3.0

pragma solidity >=0.6.0 <0.9.0;

//import "@openzeppelin/contracts-upgradeable/proxy/utils/Initializable.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@aave/protocol-v2/contracts/interfaces/ILendingPool.sol";
import "@aave/protocol-v2/contracts/interfaces/ILendingPoolAddressesProvider.sol";
import "@aave/protocol-v2/contracts/interfaces/IAToken.sol";
import {WadRayMath} from "@aave/protocol-v2/contracts/protocol/libraries/math/WadRayMath.sol";
import {PercentageMath} from "@aave/protocol-v2/contracts/protocol/libraries/math/PercentageMath.sol";

/**
 * @title for Proxy
 * @dev not implemented yet
 */
 /*
contract BaseContract is Initializable {
    uint256 public x;

    function initialize(uint256 _x) public initializer {
        x = _x;
    }
    
}
*/


/**
 * @title ClimateWarriors
 * @dev fight against the climate change with the climate warriors
 */
contract YourContract is Ownable{

    using WadRayMath for uint256;
    using PercentageMath for uint256;
    
    //IAToken DAI = IAToken(0xFf795577d9AC8bD7D90Ee22b6C1703490b6512FD);
    //IAToken aDAI = IAToken(0xdCf0aF9e59C002FA3AA091a46196b37530FD48a8);
    //IAToken USDT = IAToken(0x13512979ADE267AB5100878E2e0f485B568328a4);
    //IAToken aUSDT = IAToken(0xFF3c8bc103682FA918c954E84F5056aB4DD5189d);
    //IAToken WBTC = IAToken(0xD1B98B6607330172f1D991521145A22BCe793277);
    //IAToken aWBTC = IAToken(0x62538022242513971478fcC7Fb27ae304AB5C29F);
    
    constructor () public {
        USDC.approve(address(lendingPool), type(uint).max);
        owner = msg.sender; 
    }
    
    event Username(string _name);
    event DepositStaking(uint256 _amount, uint256 _generosity, uint256 _time);
    event Withdrawing(uint256 _amount);
    event CalcInterest(uint256 _totalBalance, uint256 _onlyInterest, uint256 _earned, uint256 _donated );

    // Kovan //
    address usdcAddress = 0xe22da380ee6B445bb8273C81944ADEB6E8450422;
    IAToken USDC = IAToken(usdcAddress);
    IAToken aUSDC = IAToken(0xe12AFeC5aa12Cf614678f9bFeeB98cA9Bb95b5B0);
    //
    ILendingPoolAddressesProvider provider = ILendingPoolAddressesProvider(address(0x88757f2f99175387aB4C6a4b3067c77A695b0349)); // kovan address 
    ILendingPool lendingPool = ILendingPool(provider.getLendingPool());
    //

    struct Character {
        string name;
        uint256 deposited;
        uint256 totalBalance;
        uint256 onlyInterest;
        uint256 generosity; // 1-100
        uint256 earned;
        uint256 donated;
    }
    
    mapping (address => Character) public account;
    
    function setUsername(string memory _name) public {
        account[msg.sender].name = _name;
        emit Username(_name);
    }

    function depositStakeUSDC(uint256 _amount, uint256 _generosity) 
    public payable{
      require(IERC20(usdcAddress).balanceOf(msg.sender) > 0, "Staking amount must be higher than 0");
      USDC.transferFrom(msg.sender,address(this), _amount);
      account[msg.sender].deposited += _amount;
      account[msg.sender].generosity = _generosity;
      lendingPool.deposit(address(usdcAddress), _amount, address(this), 0); // 
      emit DepositStaking(_amount, _generosity, now);
    }

    function calcInterest() internal{
        account[msg.sender].totalBalance = account[msg.sender].deposited.rayMul(lendingPool.getReserveNormalizedIncome(usdcAddress));
        account[msg.sender].onlyInterest = account[msg.sender].totalBalance - account[msg.sender].deposited;
        account[msg.sender].earned = account[msg.sender].onlyInterest.percentMul(account[msg.sender].generosity.rayMul(100));
        account[msg.sender].donated = account[msg.sender].onlyInterest - account[msg.sender].earned;
        emit CalcInterest(account[msg.sender].totalBalance, account[msg.sender].onlyInterest, account[msg.sender].earned, account[msg.sender].donated);
    }

    function withdrawAll() public {
        require(account[msg.sender].deposited != 0, "You don't have any funds here!");
        calcInterest();
        uint256 ownBalance = account[msg.sender].totalBalance-account[msg.sender].donated;
        account[msg.sender].deposited = 0;
        account[msg.sender].totalBalance = 0;
        account[address(this)] = account[msg.sender].donated;
        lendingPool.withdraw(address(usdcAddress), ownBalance, msg.sender);
        emit Withdrawing(ownBalance);
    }

    function setOwner(address newOwner) ownerOnly external {
     owner = newOwner;
  }
}


